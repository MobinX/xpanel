import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import WebSocket, { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { exec } from 'child_process';

const dev = process.env.NODE_ENV != "production"
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const pipelineAsync = promisify(pipeline);

// ---------------------------------------------------------
// Data Structures (Types) for Messages
// ---------------------------------------------------------

interface FS_Operation {
  type: 'FS_OP';
  cmd: 'copy' | 'cut' | 'read' | 'delete' | 'write'; 
  srcFiles?: string | string[]; // Optional for 'write' if sending content directly
  dst?: string;              // For 'copy', 'cut', and 'write'
  content?: string;           // Optional content for direct writing
}

interface ShellCommand {
  type: 'SHELL_CMD';
  cmd: string;
}

type ClientMessage = FS_Operation | ShellCommand;

interface FS_Progress {
  type: 'FS_PROGRESS';
  msg: string;
  perFileProgress?: number;
  overallProgress?: number;
}

interface FS_Content {
  type: 'FS_CONTENT';
  name: string;
  progress: number;
  newChunk: string;
}

interface ShellOutput {
  type: 'SHELL_OUT';
  newOutput: string;
}

type ServerMessage = FS_Progress | FS_Content | ShellOutput;

// ---------------------------------------------------------
// WebSocket Server Logic
// ---------------------------------------------------------
// app.prepare().then(() => {
    // const server = createServer(async (req, res) => {
    //   try {
    //     const parsedUrl = parse(req.url as string, true);
    //     const { pathname, query } = parsedUrl;
    //     // ... ( existing route handling logic) 
    //     await handle(req, res, parsedUrl);
    //   } catch (err) {
    //     console.error('Error occurred handling', req.url, err);
    //     res.statusCode = 500;
    //     res.end('internal server error');
    //   }
    // })
    //   .once('error', (err) => {
    //     console.error("server error",err);
    //     process.exit(1);
    //   })
    //   .listen(port, () => {
    //     console.log(`> Ready on http://${hostname}:${port}`);
    //   });
      // === WebSocket Server Integration ===
      const wss = new WebSocketServer({ port:4000 }); 
      wss.on('connection', (ws:WebSocket) => {
        console.log('Client connected');
        ws.on('message', async (message) => {
           
          try {
            const data: ClientMessage = JSON.parse(message.toString());
      
            if (data.type === 'FS_OP') {
              handleFSOperation(ws, data);
            } else if (data.type === 'SHELL_CMD') {
              handleShellCommand(ws, data);
            }
          } catch (error) {
            ws.send(JSON.stringify({ error: `Error processing message: ${error}` }));
          }
        });
        ws.on('close', () => console.log('Client disconnected'));
      });
      
//   });
// ---------------------------------------------------------
// File System and Shell Command Handlers
// ---------------------------------------------------------

async function handleFSOperation(ws: WebSocket, data: FS_Operation) {
  const { cmd, srcFiles, dst, content } = data;
  let totalFiles = Array.isArray(srcFiles) ? srcFiles.length : 1;
  let completedFiles = 0;

  const sendProgress = (msg: string, perFileProgress?: number, currentFile?: string) => {
    completedFiles += perFileProgress ? 1 : 0; 
    const overallProgress = Math.round((completedFiles / totalFiles) * 100);
    const progressMessage = currentFile ? `${msg} - ${currentFile}` : msg;
    ws.send(JSON.stringify({ type: 'FS_PROGRESS', msg: progressMessage, perFileProgress, overallProgress } as FS_Progress));
  };

  try {
    switch (cmd) {
      case 'copy':
        if (typeof srcFiles === "string") {
          await copyLargeFileOrFolder(ws, srcFiles, dst!, sendProgress);
        } else if (Array.isArray(srcFiles)) {
          for (const src of srcFiles) {
            await copyLargeFileOrFolder(ws, src, dst!, sendProgress);
          }
        }
        break;

      case 'cut':
        if (typeof srcFiles === "string") {
          await moveFile(ws, srcFiles, dst!, sendProgress);
        } else if (Array.isArray(srcFiles)) {
          for (const src of srcFiles) {
            await moveLargeFileOrFolder(ws, src, dst!, sendProgress);
          }
        }
        break;

      case 'read':
        if (typeof srcFiles === 'string') {
          await readLargeFile(ws, srcFiles, sendProgress);
        } else if (Array.isArray(srcFiles)) {
          for (const src of srcFiles) {
            await readLargeFile(ws, src, sendProgress);
          }
        }
        break;

      case 'delete':
        if (typeof srcFiles === "string") {
          await deleteLargeFileOrFolder(ws, srcFiles, sendProgress);
        } else if (Array.isArray(srcFiles)) {
          for (const src of srcFiles) {
            await deleteLargeFileOrFolder(ws, src, sendProgress);
          }
        }
        break;

      case 'write':
        if (content) { 
          await writeFile(dst!, content, ws);
        } else if (typeof srcFiles === 'string') {
          await readFileAndWrite(srcFiles, dst!, ws); 
        } else {
          ws.send(JSON.stringify({ error: 'Invalid source for write operation.' }));
        }
        break;

      default:
        ws.send(JSON.stringify({ error: 'Invalid FS_OP command.' }));
    }
  } catch (error) {
    ws.send(JSON.stringify({ error: `Error during FS operation: ${error}` }));
  }
}

function handleShellCommand(ws: WebSocket, data: ShellCommand) {
  const { cmd } = data;
  try {
    const child = exec(cmd);

    child.stdout?.on('data', (data) => {
      ws.send(JSON.stringify({ type: 'SHELL_OUT', newOutput: data } as ShellOutput));
    });

    child.stderr?.on('data', (data) => {
      ws.send(JSON.stringify({ type: 'SHELL_OUT', newOutput: `Error: ${data}` } as ShellOutput));
    });

    child.on('close', (code) => {
      ws.send(JSON.stringify({ type: 'SHELL_OUT', newOutput: `Command exited with code ${code}` } as ShellOutput));
    });
  } catch (error) {
    ws.send(JSON.stringify({ error: `Error executing command: ${error}` }));
  }
}

// ---------------------------------------------------------
// File Operation Helper Functions
// ---------------------------------------------------------

async function copyLargeFileOrFolder(
    ws: WebSocket,
    source: string,
    destination: string,
    onProgress: (msg: string, perFileProgress?: number, currentFile?: string) => void
) {
    try {
        const stats = await fs.promises.stat(source);

        if (stats.isFile()) {
            await copyFileWithProgress(ws, source, destination, onProgress);
        } else if (stats.isDirectory()) {
            await copyFolderWithProgress(ws, source, destination, onProgress);
        }
        onProgress(`Copied: ${source}`, undefined, source);
    } catch (error) {
        onProgress(`Error copying: ${source}`, undefined, source);
        throw error; // Re-throw to be caught at a higher level if needed
    }
}

async function moveLargeFileOrFolder(
    ws: WebSocket,
    source: string,
    destination: string,
    onProgress: (msg: string, perFileProgress?: number, currentFile?: string) => void
) {
    try {
        await copyLargeFileOrFolder(ws, source, destination, onProgress);
        await deleteLargeFileOrFolder(ws, source, onProgress);
        onProgress(`Moved: ${source}`, undefined, source);
    } catch (error) {
        onProgress(`Error moving: ${source}`, undefined, source);
        throw error; // Re-throw to be caught at a higher level if needed
    }
}

async function deleteLargeFileOrFolder(
    ws: WebSocket,
    filePath: string,
    onProgress: (msg: string, perFileProgress?: number, currentFile?: string) => void
) {
    try {
        const stats = await fs.promises.stat(filePath);

        if (stats.isFile()) {
            await fs.promises.unlink(filePath);
            onProgress(`Deleted: ${filePath}`, undefined, filePath);
        } else if (stats.isDirectory()) {
            await deleteFolderRecursive(filePath, onProgress);
            onProgress(`Deleted: ${filePath}`, undefined, filePath);
        }
    } catch (error) {
        onProgress(`Error deleting: ${filePath}`, undefined, filePath);
        throw error; // Re-throw to be caught at a higher level if needed
    }
}

async function readLargeFile(
    ws: WebSocket,
    filePath: string,
    onProgress: (msg: string, perFileProgress?: number, currentFile?: string) => void
) {
    try {
        const stats = await fs.promises.stat(filePath);
        const fileSizeInBytes = stats.size;
        const chunkSize = 1024 * 1024; // 1MB chunks
        let bytesRead = 0;

        const readStream = fs.createReadStream(filePath, { highWaterMark: chunkSize });

        for await (const chunk of readStream) {
            bytesRead += chunk.length;
            const progress = Math.round((bytesRead / fileSizeInBytes) * 100);
            ws.send(JSON.stringify({
                type: 'FS_CONTENT',
                name: filePath,
                progress,
                newChunk: chunk.toString()
            } as FS_Content));
        }
        onProgress(`Read: ${filePath}`, undefined, filePath);
    } catch (error) {
        onProgress(`Error reading: ${filePath}`, undefined, filePath);
        throw error; // Re-throw to be caught at a higher level if needed
    }
}


async function copyFileWithProgress(
  ws: WebSocket,
  source: string,
  destination: string,
  onProgress: (msg: string, perFileProgress?: number, currentFile?: string) => void
) {
  const stats = await fs.promises.stat(source);
  const fileSizeInBytes = stats.size;
  let bytesCopied = 0;

  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);

  readStream.on('data', (chunk) => {
    bytesCopied += chunk.length;
    const progress = Math.round((bytesCopied / fileSizeInBytes) * 100);
    onProgress(`Copying: ${source}`, progress, source); 
  });

  await pipelineAsync(readStream, writeStream);
}

async function copyFolderWithProgress(
  ws: WebSocket,
  source: string,
  destination: string,
  onProgress: (msg: string, perFileProgress?: number, currentFile?: string) => void
) {
  await fs.promises.mkdir(destination, { recursive: true });
  const entries = await fs.promises.readdir(source);

  for (const entry of entries) {
    const sourcePath = path.join(source, entry);
    const destPath = path.join(destination, entry);
    const stats = await fs.promises.stat(sourcePath);

    if (stats.isFile()) {
      await copyFileWithProgress(ws, sourcePath, destPath, onProgress);
    } else if (stats.isDirectory()) {
      await copyFolderWithProgress(ws, sourcePath, destPath, onProgress);
    }
  }
}

async function deleteFolderRecursive(folderPath: string, onProgress: (msg: string, perFileProgress?: number, currentFile?: string) => void) {
  if (fs.existsSync(folderPath)) {
    for (const entry of await fs.promises.readdir(folderPath)) {
      const fullPath = path.join(folderPath, entry);
      if ((await fs.promises.lstat(fullPath)).isDirectory()) {
        await deleteFolderRecursive(fullPath, onProgress);
      } else {
        await fs.promises.unlink(fullPath);
      }
      onProgress(`Deleted: ${fullPath}`, undefined, fullPath);
    }
    await fs.promises.rmdir(folderPath);
  }
}


async function writeFile(filePath: string, content: string, ws: WebSocket) {
  try {
    await fs.promises.writeFile(filePath, content);
    ws.send(JSON.stringify({ type: 'FS_PROGRESS', msg: `File written: ${filePath}`, overallProgress: 100 }));
  } catch (error) {
    ws.send(JSON.stringify({ error: `Error writing file: ${error}` }));
  }
}

async function readFileAndWrite(sourcePath: string, destinationPath: string, ws: WebSocket) {
  try {
    const stats = await fs.promises.stat(sourcePath);
    const fileSizeInBytes = stats.size;
    const chunkSize = 1024 * 1024; // 1MB chunks
    let bytesWritten = 0;

    const readStream = fs.createReadStream(sourcePath, { highWaterMark: chunkSize });
    const writeStream = fs.createWriteStream(destinationPath);

    readStream.on('data', (chunk) => {
      bytesWritten += chunk.length;
      const progress = Math.round((bytesWritten / fileSizeInBytes) * 100);
      ws.send(JSON.stringify({
        type: 'FS_PROGRESS',
        msg: `Writing: ${destinationPath}`,
        perFileProgress: progress
      }));
    });

    await pipelineAsync(readStream, writeStream);
    ws.send(JSON.stringify({
      type: 'FS_PROGRESS',
      msg: `File written: ${destinationPath}`,
      overallProgress: 100
    }));
  } catch (error) {
    ws.send(JSON.stringify({ error: `Error reading or writing file: ${error}` }));
  }
}

async function moveFile(ws: WebSocket, source: string, destination: string, onProgress: (msg: string, perFileProgress?: number) => void) {
  try {
    await fs.promises.rename(source, destination);
    onProgress(`Moved: ${source}`, 100);
  } catch (error) {
    onProgress(`Error moving: ${source}`);
    throw error;
  }
}
"use client";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";


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

  
export const WebSocketContext = createContext<{
    sendMsg:(msg:ClientMessage) => void
    lastMsg: any
    isInitialized:boolean
    socketError:string|null
}>({
    sendMsg: (msg:ClientMessage) => {},
    lastMsg: null, // Initialize lastMsg as null
    isInitialized:false,
    socketError:null
})

export const WebSocketManager = ({ socketUrl, children }: { socketUrl:string ,children: ReactNode }) => {
    const [lastMsg, setLastMsg] = useState<{ id: string, msg: any } | null>(null);
    const [socketError, setSocketError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(socketUrl);
        socketRef.current = socket; // Store the socket in the ref

        socket.addEventListener('open', () => {
            console.log('Connected!');
            setIsInitialized(true);
        });

        socket.addEventListener('message', (event) => {
            const msg = {
                id: crypto.randomUUID(), // Generate UUID on the client-side
                msg: event.data
            };
            setLastMsg(msg); 
        });

        socket.addEventListener('close', () => {
            console.log('Connection closed.');
            setIsInitialized(false); 
            setSocketError('Backend Connection closed'); 
        });

        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
            setSocketError('WebSocket error: ' + error);
        });

        // Clean up on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [socketUrl]); // Reconnect if socketUrl changes

    const sendMsg = (msg: ClientMessage) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(msg));
        } else {
            console.error('WebSocket is not open.');
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMsg, lastMsg, isInitialized, socketError }}>
            {children} 
        </WebSocketContext.Provider>
    );
};
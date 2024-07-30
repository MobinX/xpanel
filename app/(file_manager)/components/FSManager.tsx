"use client"
import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";
import { directoryItemType, getDir } from "../actions/fsActions";
import { useRouter, useSearchParams } from "next/navigation"
import { WebSocketContext } from "@/app/components/WebSocketManager";

export const FSContext = createContext<{
    FsHistory: string[]
    dirItems: directoryItemType[]
    currentPath: string,
    goBack: () => Promise<void>
    goNext: () => Promise<void>
    openFolder: (path: string, includeinhistory?: boolean) => Promise<void>
    loadingState: "SUCCESS" | "LOADING" | "FAILED"
    errorMsg: string
    presentHistoryIndex: number
    canGoBack: boolean
    canGoNext: boolean
    includeInHistory: boolean
    setIncludeInHistory: any
    selectMode: boolean
    selectedIds: any[]
    setSelectMode: any
    setSelectedIds: any
    OperationQue: { id: string, msg?: string, progress?: number }[]
    setOperationQue: any
    copyPathList: string[]
    cutPathList: string[]
    applyCopy: any
    applyCut: any
    applyDelete: any
    readFile: any
    writeFile: (src: string, content: string) => void
    fileContent: string


}>({
    FsHistory: [],
    dirItems: [],
    currentPath: "",
    loadingState: "LOADING",
    goBack: async () => { },
    goNext: async () => { },
    openFolder: async (path: string, includeinhistory = true) => { },
    errorMsg: "",
    canGoBack: false,
    canGoNext: false,
    presentHistoryIndex: 0,
    includeInHistory: true,
    setIncludeInHistory: () => { },
    selectMode: false,
    selectedIds: [],
    setSelectMode: () => { },
    setSelectedIds: () => { },
    OperationQue: [],
    setOperationQue: () => { },
    copyPathList: [],
    cutPathList: [],
    applyCopy: () => { },
    applyCut: () => { },
    applyDelete: () => { },
    fileContent: "",
    readFile: (src: any) => { },
    writeFile: (src: string, content: string) => { },


})

export const FSManager = ({ children }: { children: ReactNode }) => {
    const [FsHistory, setFsHistory] = useState<string[]>([])
    const [dirItems, setDirItems] = useState<directoryItemType[]>([])
    const [currentPath, setCurrentPath] = useState<string>("")
    const [loadingState, setLaodingState] = useState<"SUCCESS" | "LOADING" | "FAILED">("LOADING")
    const [errorMsg, setErrorMsg] = useState<string>("")
    const [presentHistoryIndex, setPresentHistoryIndex] = useState<number>(0)
    const [canGoBack, setCanGoBack] = useState(false)
    const [canGoNext, setCanGoNext] = useState(false)
    const [includeInHistory, setIncludeInHistory] = useState(true)

    const [selectMode, setSelectMode] = useState(false)
    const [selectedIds, setSelectedIds] = useState<any[]>([])
    const [copyPathList, setCopyPathList] = useState<string[]>([])
    const [cutPathList, setCutPathList] = useState<string[]>([])
    const [OperationQue, setOperationQue] = useState<{ id: string, msg?: string, progress?: number }[]>([])
    const [fileContent, setFileContent] = useState<string>("")



    const { sendMsg, lastMsg, isInitialized, socketError } = useContext(WebSocketContext)

    useEffect(() => {
        if (isInitialized) {
            sendMsg({
                type: "SHELL_CMD",
                cmd: "dir"
            })
        }
    }, [isInitialized])

    useEffect(() => {
        console.log(".../...")
        console.log(lastMsg)
        if (lastMsg) {
            const msg = lastMsg.msg
            if(msg.type == "error") {
                console.log("[fsManager] error ", msg.error)
                setOperationQue([])
            }
            if (msg.type == "FS_CONTENT") {
                setFileContent(fileContent + msg.newChunk)
                const opEntry = OperationQue.find(op => op.msg == "FS_READ")
                let temp: any[] = []
                if (opEntry) {
                    if (msg.progress != 100) {
                        OperationQue.map(op => { if (op != opEntry) temp.push(op); })
                        temp.push({ ...opEntry, progress: msg.progress })
                    }
                    else {
                        OperationQue.map(op => { if (op != opEntry) temp.push(op); })
                    }
                    setOperationQue(temp)
                }
            }
            if (msg.type == "FS_PROGRESS") {

                const opEntry = OperationQue.find(op => op.msg != "FS_READ")
                let temp: any[] = []
                if (opEntry) {
                    if (msg.overallProgress != 100) {
                        OperationQue.map(op => { if (op != opEntry) temp.push(op); })
                        temp.push({ ...opEntry, progress: msg.overallProgress, msg: msg.msg })
                    }
                    else {
                        OperationQue.map(op => { if (op != opEntry) temp.push(op); })
                    }
                    setOperationQue(temp)
                }
                else {
                    setOperationQue(OperationQue.concat([{ id: window.crypto.randomUUID(), msg: msg.msg, progress: msg.overallProgress }]))
                }
            }
           


        }

    }, [lastMsg])


    const applyCopy = () => {
        if (selectMode) {
            setCopyPathList(selectedIds)
            setSelectMode(false)
        }
    }

    const applyCut = () => {
        if (selectMode) {
            setCutPathList(selectedIds)
            setSelectMode(false)
        }
    }


    const applyDelete = () => {
        const opEntry = OperationQue.find(op => op.msg != "FS_READ")
        if (opEntry) { return }
        if (selectMode) {
            sendMsg({
                type: "FS_OP",
                cmd: "delete",
                srcFiles: selectedIds
            })
            setSelectMode(false)
        }
    }

    const applyPast = (dst: string) => {
        const opEntry = OperationQue.find(op => op.msg != "FS_READ")
        if (opEntry) { return }
        if (copyPathList.length > 0) {
            sendMsg({
                type: "FS_OP",
                cmd: "copy",
                srcFiles: selectedIds,
                dst: dst
            })

        }
        if (cutPathList.length > 0) {
            sendMsg({
                type: "FS_OP",
                cmd: "cut",
                srcFiles: selectedIds,
                dst: dst
            })

        }
    }
    const readFile = (src: string) => {
        setFileContent("")
        setOperationQue([{ id: window.crypto.randomUUID(), msg: "FS_READ", progress: 0 }])
        sendMsg({
            type: "FS_OP",
            cmd: "read",
            srcFiles: src
        })
    }
    const writeFile = (src: string, content: string) => {
        sendMsg({
            type: "FS_OP",
            cmd: "write",
            content: content,
            dst: src
        })
    }

    const router = useRouter();

    useEffect(() => setPresentHistoryIndex(FsHistory.length - 1), [FsHistory])
    useEffect(() => {
        if (presentHistoryIndex == 0) {
            setCanGoBack(false)
            if (FsHistory.length > 1) setCanGoNext(true);
            else setCanGoNext(false)
        }

        if (presentHistoryIndex == FsHistory.length - 1) {
            setCanGoNext(false)
            if (FsHistory.length > 1) setCanGoBack(true);
            else setCanGoBack(false)
        }

        setCurrentPath(FsHistory[presentHistoryIndex])

    }, [presentHistoryIndex])

    const openFolder = async (path: string, includeinhistory = true) => {
        try {
            setLaodingState("LOADING")
            let itm = await getDir(path)
            console.log(itm)
            if (typeof itm != "string") {
                setDirItems(itm);
                setLaodingState("SUCCESS");
                if (includeinhistory) {
                    if (FsHistory.length > 0) {
                        let tmpHistory: any[] = []
                        for (let i = 0; i <= (presentHistoryIndex); i++) {
                            tmpHistory.push(FsHistory[i])
                            console.log(tmpHistory)
                            console.log(i)
                        }
                        tmpHistory.push(path)
                        setFsHistory(tmpHistory)
                    }
                    else {
                        setFsHistory([path])
                    }
                }
            }
            else {
                setErrorMsg(itm);
                setLaodingState("FAILED")
            }
        } catch (error) {
            setErrorMsg("Something went wrong, Please try again")
            setLaodingState("FAILED")
        }
    }

    const goBack = async () => {
        if (canGoBack) {
            try {
                setLaodingState("LOADING")
                setIncludeInHistory(false)
                router.back()
                setPresentHistoryIndex(presentHistoryIndex - 1)

            } catch (error) {
                setErrorMsg("Something went wrong, Please try again")
                setLaodingState("FAILED")
            }
        }
    }
    const goNext = async () => {
        if (canGoNext) {
            try {
                setLaodingState("LOADING")
                setLaodingState("LOADING")
                setIncludeInHistory(false)
                router.forward()
                setPresentHistoryIndex(presentHistoryIndex + 1)


            } catch (error) {
                setErrorMsg("Something went wrong, Please try again")
                setLaodingState("FAILED")
            }
        }
    }

    return (
        <FSContext.Provider value={{ FsHistory, canGoBack, canGoNext, currentPath, dirItems, errorMsg, goBack, goNext, loadingState, openFolder, presentHistoryIndex, includeInHistory, setIncludeInHistory, selectMode, setSelectMode, selectedIds, setSelectedIds, applyCopy, applyCut, applyDelete, copyPathList, cutPathList, OperationQue, readFile, setOperationQue, writeFile, fileContent }} >
            {children}
        </FSContext.Provider>
    )
}
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
    setSelectedIds: () => { }

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

    const { sendMsg, lastMsg, isInitialized } = useContext(WebSocketContext)

    useEffect(() => {
        if (isInitialized) {
            sendMsg({
                type: "SHELL_CMD",
                cmd: "dir"
            })
        }
    }, [isInitialized])

    useEffect(() => {
        console.log(lastMsg)

    }, [lastMsg])


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
        <FSContext.Provider value={{ FsHistory, canGoBack, canGoNext, currentPath, dirItems, errorMsg, goBack, goNext, loadingState, openFolder, presentHistoryIndex, includeInHistory, setIncludeInHistory, selectMode, setSelectMode, selectedIds, setSelectedIds }} >
            {children}
        </FSContext.Provider>
    )
}
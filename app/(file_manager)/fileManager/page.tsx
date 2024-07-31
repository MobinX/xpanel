"use client"
import { useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { FSContext } from "../components/FSManager"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from 'react'
import { truncateString } from "@/app/components/turncateString"
import { Save, XCircle } from "lucide-react"
import { Editor } from "@monaco-editor/react"
import { getLanguageForFileName } from "../components/getLangNameForFile"


const LoadingUI = () => (
    <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="loading loading-dots w-[90px]" ></div>
    </div>
)

const removeFromArray = (arry: any[], itm: any): any[] => {
    let tempArray: any[] = []
    arry.map(it => {
        if (it != itm) tempArray.push(it)
    })
    return tempArray
}

const GridView = ({openFile}:{openFile:any}) => {
    const {  dirItems, setIncludeInHistory, selectMode, selectedIds, setSelectedIds ,} = useContext(FSContext)
    return(
        <div className="grid items-center justify-center justify-items-center grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-5  py-5 pt-0 overflow-auto " >

                    {dirItems.map((itm, k) => {
                        if (!selectMode) {
                            return (
                                itm.isFolder ? (
                                    <Link href={"/fileManager?location=" + itm.parentPath + "/" + itm.name} className="btn btn-ghost btn-lg flex-nowrap h-fit w-fit flex flex-col items-center justify-center gap-1 p-2 min-h-[auto] relative" key={k} aria-description={itm.name} onClick={() => setIncludeInHistory(true)}>
                                        <Image className="w-20 h-20 md:w-[5.5rem] md:h-[5.5rem]" alt={itm.name} src={itm.iconName} width={32} height={32} />
                                        <p className="text-sm loa">{truncateString(itm.name,15)}</p>
                                    </Link>
                                ) :
                                    (
                                        <div className="btn btn-ghost btn-lg flex-nowrap h-fit w-fit flex flex-col items-center justify-center gap-1 p-3 min-h-[auto]" key={k} aria-description={itm.name} onClick={()=> openFile(itm.parentPath + "/" + itm.name) }>
                                            <Image className="w-20 h-20 md:w-[5.5rem] md:h-[5.5rem]" alt={itm.name} src={itm.iconName} width={32} height={32} />
                                            <p className="text-sm loa">{truncateString(itm.name,15)}</p>
                                        </div>
                                    )
                            )
                        }
                        else {
                            return (
                                itm.isFolder ? (
                                    <button className="btn btn-ghost btn-lg flex-nowrap h-fit w-fit flex flex-col items-center justify-center gap-1 p-2 min-h-[auto] relative" key={k} aria-description={itm.name} onClick={() => {
                                        if (selectedIds.indexOf(itm.parentPath + "/" + itm.name) > -1) setSelectedIds(removeFromArray(selectedIds, itm.parentPath + "/" + itm.name));
                                        else setSelectedIds(selectedIds.concat([itm.parentPath + "/" + itm.name]))
                                    }} >
                                        <Image className="w-20 h-20 md:w-[5.5rem] md:h-[5.5rem]" alt={itm.name} src={itm.iconName} width={32} height={32} />
                                        <p className="text-sm loa">{truncateString(itm.name,15)}</p>
                                        {selectMode && <input type="checkbox" className="checkbox bg-base-content/30 absolute top-3 left-2 z-50" onClick={() => {
                                            if (selectedIds.indexOf(itm.parentPath + "/" + itm.name) > -1) setSelectedIds(removeFromArray(selectedIds, itm.parentPath + "/" + itm.name));
                                            else setSelectedIds(selectedIds.concat([itm.parentPath + "/" + itm.name]))
                                        }} checked={(selectedIds.indexOf(itm.parentPath + "/" + itm.name) > -1)} readOnly />}
                                    </button>
                                ) :
                                    (
                                        <button className="btn btn-ghost btn-lg flex-nowrap h-fit w-fit flex flex-col items-center justify-center gap-1 p-3 min-h-[auto] relative" key={k} aria-description={itm.name} onClick={() => {
                                            if (selectedIds.indexOf(itm.parentPath + "/" + itm.name) > -1) setSelectedIds(removeFromArray(selectedIds, itm.parentPath + "/" + itm.name));
                                            else setSelectedIds(selectedIds.concat([itm.parentPath + "/" + itm.name]))
                                        }} >
                                            <Image className="w-20 h-20 md:w-[5.5rem] md:h-[5.5rem]" alt={itm.name} src={itm.iconName} width={32} height={32} />
                                            <p className="text-sm loa">{truncateString(itm.name,15)}</p>
                                            {selectMode && <input type="checkbox" className="checkbox bg-base-content/30 absolute top-3 left-2 z-50" onClick={() => {
                                                if (selectedIds.indexOf(itm.parentPath + "/" + itm.name) > -1) setSelectedIds(removeFromArray(selectedIds, itm.parentPath + "/" + itm.name));
                                                else setSelectedIds(selectedIds.concat([itm.parentPath + "/" + itm.name]))
                                            }} checked={(selectedIds.indexOf(itm.parentPath + "/" + itm.name) > -1)} readOnly />}

                                        </button>
                                    )
                            )

                        }

                    })}
                </div>
    )
}

export const NEditor = ({closeFile,path}:{closeFile:any,path:string}) =>{
    const {readFile,fileContent,OperationQue,writeFile} = useContext(FSContext)
    const neditor = useRef<any>(null)
    const save = ()=>{
        if(neditor.current) {
            writeFile(path,neditor.current.getValue())
            closeFile()
        }

    }
    useEffect(()=>{
        readFile(path)
    },[path])
    return(
        <div className="fixed inset-0 rounded-3xl flex flex-col items-center justify-center w-full h-full">
            <div className="flex items-center justify-between w-full py-4 px-6 bg-base-100">
               <p className="text-base text-base-content">{path.split("/").pop()}</p>
               <div className="flex gap-2 items-center justify-center">
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={()=>{save()}}> <Save className="w-4 h-4" /></button>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={()=>{closeFile()}}> <XCircle className="w-4 h-4" /></button>
                </div> 
            </div>
            {((OperationQue.find(op=>op.msg=="FS_READ")) && OperationQue.find(op=>op.msg=="FS_READ")?.progress != 100) && <progress className="progress progress-secondary w-full h-1" value={OperationQue.find(op=>op.msg=="FS_READ") ? OperationQue.find(op=>op.msg=="FS_READ")?.progress : "10"} max="100"></progress> }
            <div className="w-full flex-1 h-full ">
                <Editor theme="vs-dark" className="w-full h-full" language={getLanguageForFileName(path.split("/").pop() || "")} value={fileContent} onMount={(editor)=>{neditor.current = editor}}/>
            </div>
        </div>
    )
}

export const ContextMenu = ({top,left,open}:{top:number,left:number,open:boolean}) =>{
    const {selectMode, applyCopy,applyCut,applyDelete,copyPathList,cutPathList,applyPast} = useContext(FSContext)
    const prams = useSearchParams()
    const location = prams.get("location")
    const elmRef = useRef<HTMLUListElement>(null)
    const [X,setX] = useState(0)
    const [Y,setY] = useState(0)

    useEffect(()=>{
        let myHeight = elmRef.current?.offsetHeight
        if(myHeight && ((top+myHeight) > window.innerHeight)) setY(top-myHeight)
        else  setY(top);
        let myWidth = elmRef.current?.offsetWidth
        if(myWidth && ((left+myWidth) > window.innerWidth)) {console.log(left,myWidth,window.innerHeight); setX(left-myWidth)}
        else {console.log(left,myWidth,window.innerHeight); setX(left);}
    },[top,left,elmRef])
   
  
    return(
        <ul className="menu bg-base-200 rounded-box w-64 absolute z-[9999]" style={{top:Y,left:X,display:open ? "flex": "none"}} ref={elmRef}>
            <li><button className="btn justify-start w-full" disabled={!selectMode} onClick={()=>{applyCopy()}}>Copy</button></li>
            <li><button className="btn justify-start w-full" disabled={!selectMode} onClick={()=>{applyCut()}}>Move</button></li>
            <li><button className="btn justify-start w-full" disabled={!selectMode} onClick={()=>{applyDelete()}}>Delete</button></li>
            <li><button className="btn justify-start w-full" disabled={!(copyPathList.length > 0 || cutPathList.length >0)} onClick={()=>{applyPast(location)}}>Past</button></li>
            <li><button className="btn justify-start w-full" disabled={!selectMode}>Rename</button></li>
        </ul>
    )

}

export default function FileManager() {
    const { openFolder, dirItems, loadingState, FsHistory, includeInHistory, fileContent,OperationQue } = useContext(FSContext)
    const prams = useSearchParams()
    const location = prams.get("location")
    const router = useRouter()
    const [openFilePath,setOpenFilePath] = useState("") 
    const [menuAxis,setMenuAxis] = useState<{x:number,y:number}>({x:0,y:0})
    const [openMenu,setOpenMenu] = useState(false)

    const openFile = (path:string) => { setOpenFilePath(path)}
    const closeFile = () => setOpenFilePath("")

    useEffect(()=>{
        console.log("|...|")
        console.log(fileContent)
    },[fileContent])

    useEffect(() => {
        // reset clicked to false on user click
        const handleClick = () => {
            setOpenMenu(false)
        }

        // add listener for user click
        document.addEventListener("click", handleClick)

        // clean up listener function to avoid memory leaks
        return () => {
            document.removeEventListener("click", handleClick);
          }
    }, [])


    async function loadOperations(path: string, includeHistory: boolean) {
        await openFolder(path, includeHistory)
    }

    useEffect(()=>{console.log("...||..."); console.log(OperationQue)},[OperationQue])
    
    useEffect(() => { location ? loadOperations(location, includeInHistory) : router.push("/fileManager?location=C:/Users/progr/DEV/nebula/frontend-next/") }, [location])
    return (
        <Suspense>
            <div className="w-full  h-full items-center justify-center overflow-auto" onContextMenu={(event)=>{
                event.preventDefault()
                setMenuAxis({x:event.pageX,y:event.pageY})
                setOpenMenu(true)
            }}>
            {dirItems.length > 0 && loadingState == "SUCCESS" &&
              <GridView openFile={openFile}/>
            }
            {openFilePath != "" && <NEditor closeFile={closeFile} path={openFilePath} />}
            {loadingState == "LOADING" && <LoadingUI />}
            { <ContextMenu left={menuAxis.x} top={menuAxis.y} open={openMenu}/>}
            </div>
        </Suspense>
    )
}

"use client"

import { useContext, useEffect, useRef } from "react"
import { FSContext } from "./FSManager"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, MousePointerSquareDashed, PackagePlus, Search, Trash } from "lucide-react"
import Link from "next/link"

//TODO
import { exeDeleteWeb } from "@/app/(dashboard)/actions/website/deleteWeb"

export const ActionBar = () => {
    const { goBack, setIncludeInHistory,selectedIds,selectMode,setSelectMode } = useContext(FSContext)
    const prams = useSearchParams()
    const breadCrumbsRef = useRef<HTMLDivElement>(null)
    const location = prams.get("location")
    useEffect(()=>{
        if(breadCrumbsRef.current) {
            breadCrumbsRef.current.scrollLeft = breadCrumbsRef.current.scrollWidth
        }
    })
    return (
        <div className="flex w-full gap-2 items-center justify-center my-3 px-2 py-2 bg-base-content/0 rounded-2xl" >
            <button className="btn btn-circle btn-sm btn-ghost" onClick={async () => await goBack()}><ArrowLeft className="w-5 h-5" /></button>
            <div className="breadcrumbs overflow-x-auto hide-scroll flex-1 w-full flex items-center bg-base-content/50 px-2 py-1 rounded-2xl " ref={breadCrumbsRef}>
                <ul>
                    {(location?.split("/"))?.map((path, key) => (
                        <li key={key}>
                            <Link href={"/fileManager?location=" + location?.split("/").slice(0, key + 1).join("/")} onClick={() => setIncludeInHistory(true)}>{path}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-center gap-2 bg-base-content/30 rounded-xl  w-[30%] md:w-[20%] my-3 ">
                <input className="input w-full input-sm flex-1 input-ghost focus:outline-none bg-transparent focus:bg-transparent focus:border-transparent placeholder:text-base-content" type="text" placeholder="Search..." />
                <button className="btn btn-circle btn-ghost btn-sm ">
                    <Search className="w-4 h-4" />
                </button>
            </div>
            <div className="flex items-center gap-3 md:px-2">
                        <div className="relative flex items-center justify-center">
                            {selectMode && <div className="badge absolute badge-sm rounded-full -top-[10px] -right-[8px] text-[0.7rem] h-0 p-2 bg-base-content/60 border-0">{selectedIds.length}</div>}
                            <button className="btn btn-circle btn-ghost btn-sm md:h-8 md:w-8   bg-base-content/30" onClick={() => { setSelectMode(!selectMode) }}> <MousePointerSquareDashed className="w-4 h-4" /> </button>
                        </div>
                        <div> <button className="btn btn-circle btn-sm btn-ghost bg-base-content/30 hover:bg-base-content/50" onClick={async () => { if (selectedIds.length > 0) await exeDeleteWeb(selectedIds);  }}><Trash className="w-4 h-4" /></button></div>
                        <Link href="/websites/add" ><button className="btn btn-circle btn-sm btn-ghost bg-base-content/30 hover:bg-base-content/50"><PackagePlus className="w-4 h-4" /></button> </Link>

                    </div>
        </div>
    )
}
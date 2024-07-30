"use client"

import { ArrowDownUp, CheckCheck, ChevronLeft, ChevronRight, DatabaseZap, ExternalLink, FolderCog, Globe, MousePointerSquareDashed, PackagePlus, Search, Trash } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getWebsiteList } from "../actions/website/getWebsites"
import { UUID } from "crypto"
import { exeDeleteWeb } from "../actions/website/deleteWeb"
import { useEffectOnce } from "../components/useEffectOnce"

export interface WebsiteInfo {
    id?: UUID
    name: string
    domain: string
    language: string
    framwork?: string
    database: string
    host: string
    updateUIPath: string
    updateUISrc: string
    deleteSrc: string
    filepath: string
    store?: string
}

// export const websiteDummyInfo: WebsiteInfo[] = [
//     {
//         name: "Virsys",
//         domain: "http://www.virsys.com",
//         language: "nodejs",
//         database: "virsys_db",
//         host: "192.0.0.1:5555",
//         filepath: "/home/web/htdocs"
//     }, {
//         name: "Virsys",
//         domain: "http://www.virsys.com",
//         language: "nodejs",
//         database: "virsys_db",
//         host: "192.0.0.1:5555",
//         filepath: "/home/web/htdocs"
//     }, {
//         name: "Virsys",
//         domain: "http://www.virsys.com",
//         language: "nodejs",
//         database: "virsys_db",
//         host: "192.0.0.1:5555",
//         filepath: "/home/web/htdocs"
//     }, {
//         name: "Virsys",
//         domain: "http://www.virsys.com",
//         language: "nodejs",
//         database: "virsys_db",
//         host: "192.0.0.1:5555",
//         filepath: "/home/web/htdocs"
//     }, {
//         name: "Virsys",
//         domain: "http://www.virsys.com",
//         language: "nodejs",
//         database: "virsys_db",
//         host: "192.0.0.1:5555",
//         filepath: "/home/web/htdocs"
//     },

// ]

const removeFromArray = (arry: any[], itm: any): any[] => {
    let tempArray: any[] = []
    arry.map(it => {
        if (it != itm) tempArray.push(it)
    })
    return tempArray
}
// const WebsiteList = ({ websiteInfo }: { websiteInfo: WebsiteInfo[] }) => {

//     return (

//     )
// }
// const ActionsRow1 = () => (

// )

// const ActionsRow2 = () => (

// )

const Loading = () => {
    return <div className="text-3xl">Loading.....</div>
}

const ListItem = ({ info, isSelectionMode, onSelectionChanged = () => { }, isChecked = false }: { info: WebsiteInfo, onSelectionChanged?: Function, isSelectionMode: boolean, isChecked?: boolean }) => {

    return (
        <>
            {isSelectionMode && <input type="checkbox" className="checkbox bg-base-content/30" onChange={() => onSelectionChanged()} checked={isChecked} />}
            <Globe className="w-9 h-9 hidden md:block" />
            <div className="flex flex-col items-start justify-start gap-1  w-full mb-2 ">
                <h1 className="">{info.name}</h1>
                <div className="flex items-center  gap-1">
                    <a href={info.domain} className="flex items-center hover:text-base-100">{info.domain} <ExternalLink className="ml-1 w-3 h-3" /></a>
                    <p className="hidden md:block">|</p>
                    <p className="hidden md:block">{info.host}</p>
                    <p className="hidden md:block">|</p>
                    <p className="hidden md:block">{info.language}</p>

                </div>
            </div>

            <Link className="flex items-center gap-1 md:gap-2 hover:text-base-100" href={`/files/${info.filepath}`}><button className="btn btn-circle btn-ghost "> <FolderCog className="w-4 h-4" /> </button></Link>
            <Link className="flex items-center gap-1 md:gap-2 hover:text-base-100" href={`/database/edit?name=${info.database}`}> <button className="btn btn-circle btn-ghost "><DatabaseZap className="w-4 h-4" /> </button> </Link>
        </>
    )
}

export default function Websites() {
    const [selectedIds, setSelectedIds] = useState<any[]>([])
    const [loadDataState, setLaodDataState] = useState<"SUCCESS"|"LOADING" | "FAILED">("LOADING")
    
    const loadList = async () => {
        const tempList = await getWebsiteList()
        if (tempList && tempList?.length == 0) { setWebsiteList(null); return }
        if (tempList) { setWebsiteList(tempList); setLaodDataState("SUCCESS");setSelectedIds([])}
        else { setLaodDataState("FAILED") }
    }
    const [websiteLst, setWebsiteList] = useState<WebsiteInfo[] | null>([])
    const [selectMode, setSelectMode] = useState(false)
    useEffectOnce(() => {

        loadList()
    })
    return (
        <div className="flex flex-col h-full w-full  items-center overflow-hidden mb-3">
            {/* <ActionsRow1 /> */}
            {
                <div className="flex justify-between items-center w-full md:my-2">
                    <div className="flex items-center gap-2 bg-base-content/30 rounded-xl w-[60%]  md:w-[40%] my-3 ">
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
                        <div> <button className="btn btn-circle btn-sm btn-ghost bg-base-content/30 hover:bg-base-content/50" onClick={async () => { if (selectedIds.length > 0) await exeDeleteWeb(selectedIds); await loadList(); }}><Trash className="w-4 h-4" /></button></div>
                        <Link href="/websites/add" ><button className="btn btn-circle btn-sm btn-ghost bg-base-content/30 hover:bg-base-content/50"><PackagePlus className="w-4 h-4" /></button> </Link>

                    </div>
                </div>
            }

            {/* <ActionsRow2 /> */}

            {<div className="flex justify-between items-center mb-3 w-full px-3">
                {/* <div className="flex items-center gap-1"><Activity className="w-4 h-4 hidden md:block" />{websiteDummyInfo.length} items found</div> */}
                <div className="flex gap-2 items-center justify-center">
                    <ArrowDownUp className="w-5 h-5" />
                    <p className="hidden ">Sort by :</p>
                    <select className="select select-sm bg-base-content/30 rounded-md text-base-200 focus:outline-none">
                        <option className="">Name (A to Z)</option>
                        <option>Name (Z to A)</option>
                        {/* <option>Date (Recent)</option>
                            <option>Date (old)</option> */}
                    </select>
                </div>
                <div className="flex items-center gap-1">

                    <p className="hidden md:block">Pages : </p><p>{websiteLst?.length}/{20}</p>
                    <div className="flex items-center ">
                        <button className="btn btn-circle btn-sm btn-ghost w-6 md:w-8"><ChevronLeft className="w-4 h-4" /></button>
                        <button className="btn btn-circle btn-sm btn-ghost w-6 md:w-8"><ChevronRight className="w-4 h-4" /></button>

                    </div>
                </div>

            </div>}

            {websiteLst && websiteLst?.length > 0 &&
                <div className="flex flex-col items-center w-full h-full gap-4 md:gap-5  overflow-y-auto">
                    {websiteLst?.map((info, key) => {
                        if (selectMode) {
                            return (
                                <button className="btn btn-ghost btn-lg flex-nowrap flex justify-center md:space-x-4 items-center w-full px-3 md:px-7 py-[2.125rem] md:py-10 bg-base-content/5 hover:bg-base-content/20 cursor-pointer transition duration-200 rounded-lg text-[15px] md:text-base" key={key} onClick={() => {
                                    if (selectedIds.indexOf(info.id) > -1) setSelectedIds(removeFromArray(selectedIds, info.id));
                                    else setSelectedIds(selectedIds.concat([info.id]))
                                }}>
                                    <ListItem isSelectionMode={selectMode} info={info} isChecked={(selectedIds.indexOf(info.id) > -1)} onSelectionChanged={() => {
                                        if (selectedIds.indexOf(info.id) > -1) setSelectedIds(removeFromArray(selectedIds, info.id));
                                        else setSelectedIds(selectedIds.concat([info.id]))
                                    }} />

                                </button>
                            )
                        } else {
                            return (
                                <Link href={`/websites/edit?id=${info.id}`} className="btn btn-ghost btn-lg flex-nowrap flex justify-center md:space-x-4 items-center w-full px-3 md:px-7 py-[2.125rem] md:py-10 bg-base-content/5 hover:bg-base-content/20 cursor-pointer transition duration-200 rounded-lg text-[15px] md:text-base" key={key}>
                                    <ListItem isSelectionMode={selectMode} info={info} />
                                </Link>
                            )
                        }

                    }
                    )}
                </div>
            }
            {loadDataState == "LOADING" && <Loading />}
            {loadDataState == "FAILED" && <p>Failed to Load , Something Went Wrong</p>}

            {websiteLst == null && <p>No Websites</p>}
            {/* <div className="flex justify-end items-center w-full px-3 gap-3 my-2">
                    Pages: {3}/{20}  <div className="flex gap-2 items-center ">
                        <button className="btn btn-circle btn-sm btn-ghost"><ChevronLeft className="w-4 h-4" /></button>
                        <button className="btn btn-circle btn-sm btn-ghost"><ChevronRight className="w-4 h-4" /></button>

                    </div>
                </div> */}
        </div>
    )
}








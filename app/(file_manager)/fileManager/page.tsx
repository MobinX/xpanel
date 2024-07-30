"use client"
import { useContext, useEffect } from "react"
import Image from "next/image"
import { FSContext } from "../components/FSManager"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from 'react'
import { truncateString } from "@/app/components/turncateString"


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

const GridView = () => {
    const {  dirItems, setIncludeInHistory, selectMode, selectedIds, setSelectedIds } = useContext(FSContext)
    return(
        <div className="grid items-center justify-center justify-items-center grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-5  py-5 pt-0 overflow-auto hide-scroll" >

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
                                        <div className="btn btn-ghost btn-lg flex-nowrap h-fit w-fit flex flex-col items-center justify-center gap-1 p-3 min-h-[auto]" key={k} aria-description={itm.name}>
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
                                        }} checked={(selectedIds.indexOf(itm.parentPath + "/" + itm.name) > -1)} />}

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
                                            }} checked={(selectedIds.indexOf(itm.parentPath + "/" + itm.name) > -1)} />}

                                        </button>
                                    )
                            )

                        }

                    })}
                </div>
    )
}

export default function FileManager() {
    const { openFolder, dirItems, loadingState, FsHistory, includeInHistory } = useContext(FSContext)
    console.log(FsHistory)
    const prams = useSearchParams()
    const location = prams.get("location")
    const router = useRouter()

    async function loadOperations(path: string, includeHistory: boolean) {
        await openFolder(path, includeHistory)
    }


    console.log(location)
    useEffect(() => { location ? loadOperations(location, includeInHistory) : router.push("/fileManager?location=C:/Users/progr/DEV/nebula/frontend-next/") }, [location])
    return (
        <Suspense>
            {dirItems.length > 0 && loadingState == "SUCCESS" &&
              <GridView />
            }
            {loadingState == "LOADING" && <LoadingUI />}
        </Suspense>
    )
}

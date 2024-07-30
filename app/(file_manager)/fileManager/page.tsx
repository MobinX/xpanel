"use client"
import { useContext, useEffect, useState } from "react"
import { directoryItemType, getDir } from "../actions/fsActions"
import { useEffectOnce } from "@/app/(dashboard)/components/useEffectOnce"
import Image from "next/image"
import { FSContext } from "../components/FSManager"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from 'react'


const LoadingUI = () => (
    <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="loading loading-dots w-[90px]" ></div>
    </div>
)

export default function FileManager() {
    const { openFolder, dirItems, loadingState, goBack, goNext, FsHistory,includeInHistory,setIncludeInHistory } = useContext(FSContext)
    console.log(FsHistory)
    const prams = useSearchParams()
    const location = prams.get("location")
    const router = useRouter()

    async function loadOperations(path: string,includeHistory:boolean) {
        await openFolder(path,includeHistory)
    }
    
    
    console.log(location)
    useEffect(() => { location ? loadOperations(location,includeInHistory) : router.push("/fileManager?location=C:/Users/progr/DEV/nebula/frontend-next/" )},[location])
    return (
        <Suspense>
            {dirItems.length > 0 && loadingState == "SUCCESS" &&
                <div className="grid items-center justify-center justify-items-center grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-5 px-2 py-5 overflow-auto hide-scroll" >
                    <button onClick={async () => await goBack()}>Back</button>
                    <button onClick={async () => await goNext()}>Next</button>

                    {dirItems.map((itm, k) => (
                        itm.isFolder ? (
                            <Link href={"/fileManager?location="+itm.parentPath + "/" + itm.name} className="btn btn-ghost btn-lg flex-nowrap h-fit w-fit flex flex-col items-center justify-center gap-1 p-3 min-h-[auto]" key={k}  aria-description={itm.name} onClick={()=> setIncludeInHistory(true)}>
                                <Image className="w-20 h-20 md:w-[5.5rem] md:h-[5.5rem]" alt={itm.name} src={itm.iconName} width={32} height={32} />
                                <p className="text-sm loa">{itm.name}</p>
                            </Link>
                        ) :
                            (
                                <div className="btn btn-ghost btn-lg flex-nowrap h-fit w-fit flex flex-col items-center justify-center gap-1 p-3 min-h-[auto]" key={k}  aria-description={itm.name}>
                                    <Image className="w-20 h-20 md:w-[5.5rem] md:h-[5.5rem]" alt={itm.name} src={itm.iconName} width={32} height={32} />
                                    <p className="text-sm loa">{itm.name}</p>
                                </div>
                            )

                    ))}
                </div>
            }
            {loadingState == "LOADING" && <LoadingUI />}
        </Suspense>
    )
}
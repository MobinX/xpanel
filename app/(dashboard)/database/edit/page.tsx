"use client"

import { useSearchParams } from "next/navigation"
import { getOneDB } from "../../actions/DB/getDBs"
import { useEffect, useState } from "react"
import { DBInfo } from "../page"
import { useEffectOnce } from "../../components/useEffectOnce"
import { useFormState } from "react-dom"
import { getUI } from "../../actions/getUI"
import { DrawUI, UIInterface } from "../../components/DrawUI"
import Link from "next/link"
import { exeUpdateDB } from "../../actions/DB/updateDBInfo"
import { Suspense } from 'react'


export default function DBInfoPage() {
    const [loadDataState, setLaodDataState] = useState<"SUCCESS" | "LOADING" | "FAILED">("LOADING")

    const param = useSearchParams()
    const _name: any = param.get("name")
    useEffectOnce(()=>{if(!_name) {setLaodDataState("FAILED")}})


    const [DB, setDB] = useState<DBInfo>()
    const [formState, formAction] = useFormState(exeUpdateDB, {msg:"hi"})
    const [steps, setSteps] = useState(1)
    const [UIs, setUIs] = useState<UIInterface[]>([])
    const loadDB = async () => {
        const DBinfo = await getOneDB(_name)
        if (DBinfo) {
            setDB(DBinfo)
            console.log(DBinfo)
            await fetchUI(DBinfo.updateUIPath)
            setLaodDataState("SUCCESS")
        }
        else {setLaodDataState("FAILED")}

    }
    const fetchUI = async (uiPath: string) => {
        const uis = await getUI(uiPath)
        if (uis) {
            setUIs(uis)
            console.log("got ui") 
            setLaodDataState("SUCCESS")

        }
        else {setLaodDataState("FAILED")}

    }
    useEffect(() => {
        if (formState.msg == "ok") setSteps(2)
    }, [formState])
    useEffectOnce(() => {
        loadDB()
    })
    return <Suspense>
    <div className="flex w-full h-full justify-center pt-4 overflow-hidden">
        {steps == 1 && loadDataState == "SUCCESS" &&
            <div className="w-full bg-base-content/15 rounded-3xl flex flex-col px-5 md:px-12 lg:px-16 lg:w-[90%] py-6 transition-all duration-500">
                <div className="w-full text-2xl text-center mb-3"> Configure Framwork </div>
                <form action={formAction} className="flex flex-col h-full py-4 overflow-auto px-3">
                    <div className="flex-1 ">
                        <DrawUI ui={UIs} defaults={DB?.store} />
                        <input type="text" className="hidden" name="extra-data-xp" readOnly value={JSON.stringify({ id:DB?.id, path: DB?.updateUISrc, updateUIPath: DB?.updateUIPath, updateUISrc: DB?.updateUISrc, deleteSrc: DB?.deleteSrc })} />
                    </div>
                    <div className="w-full flex items-center justify-end px-4 gap-4 my-3">
                        <button className="btn btn-sm btn-ghost bg-base-content/40 rounded-full" type="submit">Go Next</button>
                    </div>
                </form>
            </div>
        }
        {steps == 2 && loadDataState == "SUCCESS" &&
        
            <div className=" h-[80%] w-full flex flex-col justify-center items-center bg-base-content/15 rounded-3xl px-5 md:px-9 py-6 transition-all duration-500 text-3xl lg:text-5xl space-y-5">
                <p>Configuration Updated!</p>
                <Link href={"/database"} > <button className="btn btn-sm btn-ghost bg-base-content/30 rounded-full mt-5"> DBs Page</button> </Link>
            </div>
        }
         {loadDataState == "LOADING" && <p>Loading .....</p>}
        {loadDataState == "FAILED" &&
            <div className=" h-[80%] w-full flex flex-col justify-center items-center bg-base-content/15 rounded-3xl px-5 md:px-9 py-6 transition-all duration-500 text-3xl lg:text-5xl space-y-5">
                <p>Something went wrong</p>
                <Link href={"/database"} > <button className="btn btn-sm btn-ghost bg-base-content/30 rounded-full mt-5"> Database Page</button> </Link>
            </div>}
    </div>
    </Suspense>
}
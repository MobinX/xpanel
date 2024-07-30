"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { environment_web_lang, environment_web_lang_framwork } from "../../db/webManager"
import { getLangFramworksIncludeLangs } from "../../utils/data_helper"
import { DrawUI, UIInterface } from "../../components/DrawUI"
import { UIPasswordInput, UITextInput } from "../../plugin/src/developer/ui"
import { getUI } from "../../actions/getUI"
import { useFormState } from "react-dom"
import { exeAdd } from "../../actions/website/AddWeb"

export function Steps({ langs }: { langs: environment_web_lang[] }) {
    const [steps, setSteps] = useState(1)
    const [UIs, setUIs] = useState<UIInterface[]>([])
    const [environmentInfo, setEnvironmentInfo] = useState({
        lang: langs[0].name,
        lang_v: langs[0].versions[0],
        framwork: langs[0].framworks[0].name,
        framwork_v: langs[0].framworks[0].version
    })
    const [framworks, setFramworks] = useState<environment_web_lang_framwork[]>(getLangFramworksIncludeLangs(environmentInfo.lang, environmentInfo.lang_v, langs))
    const [formState, formAction] = useFormState(exeAdd, { path: `C:/Users/progr/DEV/nebula/frontend-next/app/(dashboard)/plugin/store/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.pkg}/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.executeAddSrc}`, updateUIPath:`C:/Users/progr/DEV/nebula/frontend-next/app/(dashboard)/plugin/store/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.pkg}/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.executeUpdateUIPath}`,
    updateUISrc:`C:/Users/progr/DEV/nebula/frontend-next/app/(dashboard)/plugin/store/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.pkg}/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.executeUpdateSrc}`,deleteSrc:`C:/Users/progr/DEV/nebula/frontend-next/app/(dashboard)/plugin/store/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.pkg}/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.executeDeleteSrc}` })
    useEffect(() => {
        if(formState.msg == "ok") setSteps(3)
    }, [formState])
    useEffect(() => {
        setFramworks(getLangFramworksIncludeLangs(environmentInfo.lang, environmentInfo.lang_v, langs))
    }, [environmentInfo])
    const fetchUI = async () => {
        const uis = await getUI(`C:/Users/progr/DEV/nebula/frontend-next/app/(dashboard)/plugin/store/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.pkg}/${(framworks.find(itm => itm.name == environmentInfo.framwork))?.executeAddUIPath}`)
        if (uis) {
            setUIs(uis)
            console.log("got ui")
            setSteps(2)
        }
    }
    return (
        <div className="flex w-full h-full justify-center pt-4 overflow-hidden">
            {steps == 1 &&
                <div className=" h-[80%] md:w-[75%] lg:w-[55%] flex flex-col  items-center bg-base-content/15 rounded-3xl px-5 md:px-9 py-6 transition-all duration-500">
                    <div className="flex flex-col  items-center flex-1 w-full h-full">
                        <p className="text-xl md:text-3xl my-6">Setup Environment</p>
                        <div className="flex flex-col items-start  w-full h-full  gap-5 my-3 px-1 md:px-3 lg:px-7">
                            <div className="flex gap-2 flex-wrap items-center justify-center">
                                <p className="hidd md:block">Running Language:</p>
                                <div className="flex gap-2 items-center">
                                    <select className="select select-sm bg-base-content/30 rounded-md text-base-200 focus:outline-none" value={environmentInfo.lang} onChange={(e) => setEnvironmentInfo({ ...environmentInfo, lang: e.target.value.toString() })}>
                                        {langs.map((lang, k) =>
                                            <option key={k}>{lang.name}</option>
                                        )}
                                    </select>
                                    <select className="select select-sm bg-base-content/30 rounded-md text-base-200 focus:outline-none" value={environmentInfo.lang_v} onChange={(e) => { setEnvironmentInfo({ ...environmentInfo, lang_v: e.target.value.toString() });  /*setFramworks(getLangFramworksIncludeLangs(environmentInfo.lang,  e.target.value.toString(), langs)) */ }}>
                                        {langs.find(lang => lang.name == environmentInfo.lang)?.versions.map((v, k) =>
                                            <option key={k}>{v}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap items-center justify-center">
                                <p className="hidd md:block">Framwork/Library:</p>
                                <div className="flex gap-2 items-center">
                                    <select className="select select-sm bg-base-content/30 rounded-md text-base-200 focus:outline-none" value={environmentInfo.framwork} onChange={(e) => setEnvironmentInfo({ ...environmentInfo, framwork: e.target.value.toString() })}>
                                        {framworks.map((f, k) => <option key={k}>{f.name}</option>)}
                                    </select>
                                    <select className="select  select-sm bg-base-content/30 rounded-md text-base-200 focus:outline-none" value={environmentInfo.framwork_v} onChange={(e) => setEnvironmentInfo({ ...environmentInfo, framwork_v: e.target.value.toString() })}>
                                        {framworks.map((f, k) => <option key={k}>{f.version}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-end px-4 gap-4">
                        <Link href={"/websites"} > <button className="btn btn-sm btn-ghost bg-base-content/30 rounded-full">Cancel</button> </Link>
                        <button className="btn btn-sm btn-ghost bg-base-content/40 rounded-full" onClick={async () => await fetchUI()}>Go Next</button>
                    </div>
                </div>
            }
            {steps == 2 &&
                <div className="w-full bg-base-content/15 rounded-3xl flex flex-col px-5 md:px-12 lg:px-16 lg:w-[90%] py-6 transition-all duration-500">
                    <div className="w-full text-2xl text-center mb-3"> Configure Framwork </div>
                    <form action={formAction} className="flex flex-col h-full py-4 overflow-auto px-3">
                        <div className="flex-1 ">
                            <DrawUI ui={UIs} />
                        </div>
                        <div className="w-full flex items-center justify-end px-4 gap-4 my-3">
                            <button className="btn btn-sm btn-ghost bg-base-content/40 rounded-full"  onClick={()=>setSteps(1)}>Go Back</button>
                            <button className="btn btn-sm btn-ghost bg-base-content/40 rounded-full" type="submit">Go Next</button>
                        </div>
                    </form>
                </div>
            }
            {steps == 3 && 
                <div className=" h-[80%] w-full flex flex-col justify-center items-center bg-base-content/15 rounded-3xl px-5 md:px-9 py-6 transition-all duration-500 text-3xl lg:text-5xl space-y-5">
                    <p>Finished SetUp!</p>
                    <Link href={"/websites"} > <button className="btn btn-sm btn-ghost bg-base-content/30 rounded-full mt-5"> Websites Page</button> </Link>
                </div>
            }
        </div>
    )
}
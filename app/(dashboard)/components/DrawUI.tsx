"use client"

import { useState } from "react"

export interface UIInterface {
    type: "text" | "select" | "checkbox" | "password" | "email"
    label: string
    name: string
    // data?: string[] /*for option */ | string /*for placeholder */
    data?: any
    value?: any //if it has default value

}

export const DrawUI = ({ ui, defaults= null }: { ui: UIInterface[],defaults?:any }) => {
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end justify-center w-full">
            {
                ui.map((elm, k) =>
                    (elm.type == "text" || elm.type == "email" || elm.type == "password") ?
                        (
                            <div className="flex items-start justify-center flex-col w-full" key={k}>
                                <label className="label pl-3 text-lg" htmlFor={elm.name}>{elm.label}</label>
                                <input className="input w-full   input-ghost focus:outline-none bg-base-content/30 rounded-xl focus:bg-base-content/30 focus:border-transparent placeholder:text-base-content/50" type={elm.type} placeholder={elm.data} name={elm.name} defaultValue={defaults && defaults[elm.name] ? defaults[elm.name] :elm.value} required />
                            </div>
                        ) : (elm.type == "select" ? (
                            <div className="flex gap-2 flex-wrap items-center " key={k}>
                                <label className="label  text-lg" htmlFor={elm.name}>{elm.label}</label>
                                <select className="select select-sm bg-base-content/30 rounded-md text-base-200 focus:outline-none" name={elm.name} defaultValue={defaults && defaults[elm.name] ? defaults[elm.name] :elm.value} required >
                                    {elm.data.map((v: any, ka: any) =>
                                        <option key={ka}>{v}</option>
                                    )}
                                </select>
                            </div>
                        ) : (elm.type == "checkbox" ? (
                            <div className="flex flex-wrap items-center text-[1.125rem] h-fit " key={k}>
                                <input className="checkbox bg-base-content/30 rounded-md " type="checkbox" name={elm.name}  defaultValue={defaults && defaults[elm.name] ? defaults[elm.name] :elm.value}  />
                                <label className=" pl-3 " htmlFor={elm.name}>{elm.label}</label>
                            </div>
                        ) :
                            (<></>)
                        )

                        )
                )
            }

        </div>
    )
}

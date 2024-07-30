"use server"

import { addDB } from "../../db/DBManager"
import { loadScript } from "../loadScript"

export async function exeAddDB(initialState:any,form:FormData){
    try {
        const EXECUTE = loadScript(initialState.path)
        const result:any = EXECUTE(form)
        await addDB({...result?.attr,updateUIPath:initialState.updateUIPath,updateUISrc:initialState.updateUISrc,deleteSrc:initialState.deleteSrc,store:result?.store})
    return {...initialState,msg: "ok" }
    } catch (error) {
        console.log(error)
        return {...initialState,msg:"error"}
    }
    
}
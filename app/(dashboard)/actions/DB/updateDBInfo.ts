"use server"

import { addDB, updateDBInfo } from "../../db/DBManager"
import { loadScript } from "../loadScript"

export async function exeUpdateDB(initialStat: any, form: FormData) {
    try {
        const initialState = JSON.parse(form.get("extra-data-xp") as string)
        const EXECUTE = loadScript(initialState.path)
        const result: any = EXECUTE(form)
        await updateDBInfo(initialState.id, { ...result?.attr, updateUIPath: initialState.updateUIPath, updateUISrc: initialState.updateUISrc, deleteSrc: initialState.deleteSrc,store:result.store })
        return { ...initialState, msg: "ok" }
    } catch (error) {
        console.log(error)
        return { ...initialStat, msg: "error" }
    }

}
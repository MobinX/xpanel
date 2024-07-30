"use server"

import { UUID } from "crypto"
import { addWebsite, removeManyWebsite, removeWebsite } from "../../db/webManager"
import { loadScript } from "../loadScript"

export async function exeDeleteWeb(/* path */ids:UUID[]){

        // const EXECUTE = loadScript(initialState.path)
        // const result:any = EXECUTE(form)
        // await addWebsite(result?.attr)
        const result = await removeManyWebsite(ids)
    return result
}
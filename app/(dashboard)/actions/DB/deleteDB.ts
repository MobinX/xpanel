"use server"

import { UUID } from "crypto"
import { addDB, removeManyDB, removeDB } from "../../db/DBManager"
import { loadScript } from "../loadScript"

export async function exeDeleteDB(/* path */ids:UUID[]){

        // const EXECUTE = loadScript(initialState.path)
        // const result:any = EXECUTE(form)
        // await addDB(result?.attr)
        const result = await removeManyDB(ids)
    return result
}
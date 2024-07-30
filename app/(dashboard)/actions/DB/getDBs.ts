"use server"

import { UUID } from "crypto";
import { getDBById, getDBs, DBInfo, getDBByName } from "../../db/DBManager";

export async function getDBList():Promise<DBInfo[] | null | undefined> {
    try {
        const dbList = await getDBs()
        return dbList
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function getOneDB(name:string):Promise<DBInfo | null | undefined> {
    try {
        const DB = await getDBByName(name)
        return DB
    } catch (error) {
        console.log(error)
        return null
    }
}
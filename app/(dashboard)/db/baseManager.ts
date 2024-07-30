import { readFileSync, writeFileSync } from "node:fs"
import { ENVIRONMENT_WEB } from "./webManager"
import path from "node:path"
import { ENVIRONMENT_DB } from "./DBManager"

export interface DB_INTERFACE {
    environment_web: ENVIRONMENT_WEB
    environment_db:ENVIRONMENT_DB



}

export async function loadDB():Promise<DB_INTERFACE> {
    try {
        let dbPath = path.join((process.argv[1]).replace("db.ts", ""), "db.json")
        let dbFile = readFileSync("C:/Users/progr/DEV/nebula/frontend-next/app/(dashboard)/db/db.json", { encoding: "utf-8" })
        return JSON.parse(dbFile)

    }
    catch (e) {
        throw e
    }
}
export async function saveDB(db:any) {
    try {
        let dbPath = path.join((process.argv[1]).replace("db.ts", ""), "db.json")
        console.log("execution dbPath", dbPath)
        writeFileSync("C:/Users/progr/DEV/nebula/frontend-next/app/(dashboard)/db/db.json", JSON.stringify(db),)
    }
    catch (e) {
        throw e
    }
}

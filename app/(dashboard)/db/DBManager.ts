import { randomUUID, UUID } from "node:crypto"
import { loadDB, saveDB } from "./baseManager"
export interface DBProviderExtension {
    name: string
    pkg: string
    version: string
    executeAddUIPath: string
    executeAddSrc: string
    executeUpdateUIPath: string
    executeUpdateSrc: string
    executeDeleteSrc: string
}

export interface DBInfo {
    id?: UUID
    name: string
    type: string
    domain:string
    host: string
    username: string
    password: string
    providerUrl: string
    updateUIPath: string
    updateUISrc: string
    deleteSrc: string
    store?: any
}
export interface ENVIRONMENT_DB {
    providers: DBProviderExtension[]
    DBList: DBInfo[]
}

export interface BaseResult {
    ok: boolean
    msg: string
}


export async function addDBProvider(provider: DBProviderExtension): Promise<BaseResult> {
    try {
        let DB = await loadDB()
        if ((DB.environment_db.providers.find(_provider => _provider.pkg == provider.pkg)) == undefined) {
            DB = {
                ...DB, environment_db: {
                    ...DB.environment_db,
                    providers: DB.environment_db.providers.concat([provider])
                }
            }
            await saveDB(DB)
            return {
                ok: true,
                msg: "ok"
            }
        } else {
            return {
                ok: false,
                msg: "DBProvider already exists"
            }
        }
    }
    catch (e: any) {
        console.log(e)
        return {
            ok: false,
            msg: e
        }
    }


}
export async function getDBProviders(): Promise<DBProviderExtension[]> {
    let DB = await loadDB()
    return DB.environment_db.providers
}
export async function getDBProvidersNameArray(): Promise<string[]> {
    let DB = await loadDB()
    let names: string[] = []
    DB.environment_db.providers.map(provider => names.push(provider.name))
    return names
}
export async function getDBProviderByName(name: string): Promise<DBProviderExtension | undefined> {
    let DB = await loadDB()
    return DB.environment_db.providers.find(provider => provider.name == name)
}
export async function removeDBProvider(provider: string): Promise<BaseResult> {
    try {
        let DB = await loadDB()
        let tempproviders: DBProviderExtension[] = []
        DB.environment_db.providers.map((itm) => {
            if (itm.name != provider) tempproviders.push(itm)
        })
        DB = {
            ...DB, environment_db: {
                ...DB.environment_db,
                providers: tempproviders
            }
        }
        await saveDB(DB)
        return {
            ok: true,
            msg: "ok"
        }
    }
    catch (e: any) {
        console.log(e)
        return {
            ok: false,
            msg: e
        }
    }
}


export async function addDB(db: DBInfo): Promise<BaseResult> {

    let DB = await loadDB();
    async function doit() {

        let uniqId = randomUUID()
        if ((DB.environment_db.DBList.find(_db => _db.id == uniqId)) == undefined) {
            DB = {
                ...DB, environment_db: {
                    ...DB.environment_db,
                    DBList: DB.environment_db.DBList.concat([{ ...db, id: uniqId }])
                }
            }
            await saveDB(DB)

        } else {
            await doit()
        }
    }
    try {
        let DB = await loadDB()
        // if((DB.environment_db.DBList.find(_db => _db.name == db.name)) == undefined){
        //     return {
        //         ok:false,
        //         msg:"DB NAME ALREADY EXISTS"
        //     }
        // }
        await doit()
        return {
            ok: true,
            msg: "ok"
        }

    }
    catch (e: any) {
        console.log(e)
        return {
            ok: false,
            msg: e
        }
    }
}
export async function getDBs(): Promise<DBInfo[]> {
    let DB = await loadDB()
    return DB.environment_db.DBList
}
export async function getDBsNameArray(): Promise<string[]> {
    let DB = await loadDB()
    let names: string[] = []
    DB.environment_db.DBList.map(db => names.push(db.name))
    return names
}
export async function getDBById(id: UUID): Promise<DBInfo | undefined> {

    let DB = await loadDB()
    return DB.environment_db.DBList.find(_db => _db.id == id)
}
export async function getDBByName(name: string): Promise<DBInfo | undefined> {

    let DB = await loadDB()
    return DB.environment_db.DBList.find(_db => _db.name == name)
}

export async function updateDBInfo(id: UUID, info: DBInfo): Promise<BaseResult> {
    try {
        let DB = await loadDB()
        let dbPortion = DB.environment_db.DBList.find(_db => _db.id == id)


        if (dbPortion) {

            let tempDBs: DBInfo[] = []
            DB.environment_db.DBList.map(_db => {
                if (_db.id != id) tempDBs.push(_db)
            })
            tempDBs.push({ ...dbPortion, ...info })
            DB = {
                ...DB, environment_db: {
                    ...DB.environment_db,
                    DBList: tempDBs
                }
            }
            await saveDB(DB)
            return {
                ok: true,
                msg: "ok"
            }
        }
        else {
            return {
                ok: false,
                msg: "db with that id dont exists"
            }
        }
    }
    catch (e: any) {
        console.log(e)
        return {
            ok: false,
            msg: e
        }
    }
}
export async function removeDB(id: UUID): Promise<BaseResult> {
    try {
        let DB = await loadDB()
        let tempDBs: DBInfo[] = []
        DB.environment_db.DBList.map((itm) => {
            if (itm.id != id) tempDBs.push(itm)
        })
        DB = {
            ...DB, environment_db: {
                ...DB.environment_db,
                DBList: tempDBs
            }
        }
        await saveDB(DB)
        return {
            ok: true,
            msg: "ok"
        }
    }
    catch (e: any) {
        console.log(e)
        return {
            ok: false,
            msg: e
        }
    }
}
export async function removeManyDB(ids: any[]): Promise<BaseResult> {
    try {
        let DB = await loadDB()
        let tempDBs: DBInfo[] = []
        DB.environment_db.DBList.map((itm) => {
            if (ids.indexOf(itm.id) < 0) tempDBs.push(itm)
        })
        DB = {
            ...DB, environment_db: {
                ...DB.environment_db,
                DBList: tempDBs
            }
        }
        await saveDB(DB)
        return {
            ok: true,
            msg: "ok"
        }
    }
    catch (e: any) {
        console.log(e)
        return {
            ok: false,
            msg: e
        }
    }
}

(async () => {
    let dummyDB: DBProviderExtension = {
        name: "mySQLd",
        version: "11.0.1",
        pkg: "com.mbn.xpanel",
        executeAddSrc: "add.js",
        executeAddUIPath: "addui.js",
        executeUpdateSrc: "add.js",
        executeUpdateUIPath: "addui.js",
        executeDeleteSrc: "add.js"

    }
    let rn = await addDBProvider(dummyDB)

    console.log(rn)
})();
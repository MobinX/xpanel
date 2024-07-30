"use server"
import {readFileSync } from "node:fs"
import { UIInterface } from "../components/DrawUI";
import { getDBsNameArray } from "../db/DBManager";

export async function getUI(path:string):Promise<UIInterface[] | undefined> {
    try{
        var UI:UIInterface[] = []
        var DATABASE_NAME_LIST = await getDBsNameArray()
        eval(readFileSync(path,{encoding:"utf-8"})) 
        return UI
    }
    catch (e) {
        console.log("=================================")
        console.log(e)
        return
    }
}
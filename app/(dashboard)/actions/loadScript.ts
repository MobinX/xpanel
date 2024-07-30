import { readFileSync } from "node:fs";

export  function loadScript(path:string):any | undefined | null {
    var EXECUTE = null;
    try{
        eval(readFileSync(path,{encoding:"utf-8"})) 
        return EXECUTE
    }
    catch (e) {
        console.log("=================================")
        console.log(e)
        return
    }
}
"use server"
import { Dirent, readdirSync, stat, statSync } from "node:fs"
import  {jsn} from "./icons"
export interface directoryItemType {
    name: string
    path: string
    parentPath: string
    isFolder: boolean
    size:string
    iconName:string



}
 
type jsn = any;

function modifyFileSize(size:number,presentType="byte"):string{
    if(((size.toString().split("."))[0]).length >= 4) { //if the first part of . in number or real part has 4 digit, it needs conversion
        let converted = size / 1024
        if(presentType == "byte") return modifyFileSize(converted,"KB");
        if(presentType == "KB") return modifyFileSize(converted,"MB");
        if(presentType == "MB") return modifyFileSize(converted,"GB");
        if(presentType == "GB") return modifyFileSize(converted,"TB");
        else {return modifyFileSize(converted,"TB")}
    }
    else {
        //retrun string with units
        let realp = (size.toString().split("."))[0]
        let decimal = (size.toString().split("."))[1]

        return realp +  (decimal && decimal[0] ? "." + decimal[0] : "") + (decimal && decimal[1] ? decimal[1] : "") + " " + presentType
    }

}

 function handleFSError(error: any) {
    console.log(error)
    switch (error.code) {
        case "ENOENT":
            return  "No such file or directory. This error occurs when a specified file or directory does not exist."
        case "EACCES":
            return   'Permission denied. This error occurs when the operation is not permitted due to insufficient permissions.'
        case "EEXIST":
            return   "File exists. This error occurs when attempting to create a file or directory that already exists."
        case "EISDIR":
            return   "Is a directory. This error occurs when an operation expected a file but found a directory instead."
        case "EBADF":
            return   "Bad file descriptor. This error occurs when an invalid file descriptor is used."
        case "EINVAL":
            return   "Invalid argument. This error occurs when an invalid argument is passed to a function."
        case "EPERM":
            return   "Operation not permitted. This error occurs when the operation is not allowed."
        case "ENOSPC":
            return   "No space left on device. This error occurs when there is no more space on the disk."
        case "EIO":
            return   "Input/output error. This error occurs due to a generic I/O error."
        default:
            return "Something went wrong.Please try another way"
    }
}

function getIconName(name:string,isDirectory:boolean):string{

    if(isDirectory){
        //check for folder name first
        if(Object.keys(jsn.folderNames).indexOf(name) > -1) return jsn.iconDefinitions[jsn.folderNames[name]].iconPath;
        else return (jsn.iconDefinitions[jsn.folder]).iconPath
    }
    else {
        if(Object.keys(jsn.fileNames).indexOf(name) > -1) return jsn.iconDefinitions[jsn.fileNames[name]].iconPath;
        else {
            let fileExt = (name.split(".")).pop()
            if(fileExt && Object.keys(jsn.fileExtensions).indexOf(fileExt) > -1) return jsn.iconDefinitions[jsn.fileExtensions[fileExt]].iconPath;
            else return jsn.iconDefinitions[jsn.file].iconPath
        }
    }
}

export async function getDir(path: string):Promise<directoryItemType[] | string> {
    console.log((jsn.iconDefinitions[jsn.folder]).iconPath)
    try {
        let dItems:directoryItemType[] = []
        const directoryItems = readdirSync(path, { withFileTypes: true })
        directoryItems.map(dt => {
            let state = statSync(dt.parentPath + "/" + dt.name)
            dItems.push({
                name:dt.name,
                isFolder:dt.isDirectory(),
                path:dt.parentPath,
                parentPath:dt.parentPath,
                size:dt.isDirectory() ? "" :modifyFileSize(state.size),
                iconName: `${getIconName(dt.name,dt.isDirectory())}`


            })
        })
        return dItems;

    } catch (error) {
        return handleFSError(error)
        
    }
}

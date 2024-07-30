"use server"

import { UUID } from "crypto";
import { getWebsiteById, getWebsits, WebsiteInfo } from "../../db/webManager";

export async function getWebsiteList():Promise<WebsiteInfo[] | null | undefined> {
    try {
        const webList = await getWebsits()
        return webList
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function getOneWebsite(id:UUID):Promise<WebsiteInfo | null | undefined> {
    try {
        const website = await getWebsiteById(id)
        return website
    } catch (error) {
        console.log(error)
        return null
    }
}
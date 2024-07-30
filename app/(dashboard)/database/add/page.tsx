import Link from "next/link"
import { useState } from "react"
import { getDBProviders } from "../../db/DBManager"
import { Steps } from "./Steps"
export default async function WebsiteAdd() {
    const DBProviders = await getDBProviders()
    return <Steps providers={DBProviders} />
}
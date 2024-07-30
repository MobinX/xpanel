"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Breadcums() {
    const pathnames = (usePathname()).split("/")
    //remove first one 
    pathnames.shift()
    return (
        <div className="breadcrumbs text-xl font-semibold md:text-2xl overflow-x-visible px-2">
            <ul>
                {pathnames.map((pathname, key) => (
                    <li key={key}>
                        <Link href={"/" + pathnames.slice(0, key+1).join("/")} style={{ filter: "brightness(10)" }} >{pathname[0].toUpperCase()+pathname.slice(1)}</Link>
                    </li>
                ))}
            </ul>
        </div>)
}
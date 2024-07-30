"use client"
import { BringToFront, DatabaseZap, Globe2, Home, ShoppingCart, UserRoundCog } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ForwardRefExoticComponent } from "react"
export const NavigationIcons: { name: string, icon: ForwardRefExoticComponent<any>, slug: string }[] = [
    {
        name: "Home",
        slug: "/home",
        icon: Home
    },{
        name: "Databases",
        slug: "/database",
        icon: DatabaseZap
    },{
        name: "Websites",
        slug: "/websites",
        icon: Globe2
    },
    {
        name: "Users",
        slug: "/users",
        icon: UserRoundCog
    },
    
    {
        name: "Category",
        slug: "/category",
        icon: BringToFront
    },
    

]


export const SideBar = () =>{
    const pathnames = (usePathname()).split("/")

    return (
        <div className=" h-full flex-col justify-center items-center gap-11 px-6 py-6 hidden md:flex">
                    {NavigationIcons.map((icon, key) =>
                        <Link href={icon.slug} key={key} className="tooltip tooltip-right text-base-content before:bg-base-content/20 before:text-base-content after:opacity-0" data-tip={icon.name}>
                            <button className={`btn btn-circle btn-ghost bg-base-content/30 w-[2.9rem] h-[2.9rem] min-h-[2rem] ${icon.slug == "/" + pathnames[1] && "bg-base-content/60"}`} >
                                <icon.icon className="w-6 h-6" />
                            </button>
                        </Link>
                    )}
                </div>
    )
}
// side navigation -- [End]

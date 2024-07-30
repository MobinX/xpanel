import { BringToFront, Globe2, Home, ShoppingCart, UserRoundCog } from "lucide-react"
import Link from "next/link"
import { ForwardRefExoticComponent, ReactNode } from "react"

// export const BgWrapper = ({ children }: { children: ReactNode }) => {
//     return (
//         <div className="w-full h-full min-h-screen flex flex-col justify-center items-center relative bg-base-100 text-base-content">
//             <div className="w-full h-full absolute z-50 inset-0 min-h-screen flex justify-center items-center text-base-content" style={{ backdropFilter: "blur(400px) brightness(0.6)" }}>
//                 {children} </div>
//             <div className="top-0 left-0 absolute w-1/4 h-full rounded-full bg-yellow-600" style={{ animation: "leftToRsight 5s infinite" }}></div>
//             <div className="top-0 left-1/4 absolute w-1/4 h-full rounded-full bg-purple-500" ></div>
//             <div className="top-0 right-1/4 absolute w-1/4 h-full rounded-full bg-yellow-600"></div>
//             <div className="top-0 right-0 absolute w-1/4 h-full rounded-full bg-purple-500" style={{ animation: "rightTosLeft 5s infinite" }}></div>

//         </div>)
// }


// //Side Navigations - [start]
// export const NavigationIcon: { name: string, icon: ForwardRefExoticComponent<any>, slug: string }[] = [
//     {
//         name: "Home",
//         slug: "/home",
//         icon: Home
//     },
//     {
//         name: "Users",
//         slug: "/users",
//         icon: UserRoundCog
//     },
//     {
//         name: "Priducts",
//         slug: "/products",
//         icon: ShoppingCart
//     },
//     {
//         name: "Category",
//         slug: "/category",
//         icon: BringToFront
//     },
//     {
//         name: "Websites",
//         slug: "/websites",
//         icon: Globe2
//     },

// ]


// export const SideBar = () =>{
//     return (
//         <div className="flex h-full flex-col justify-center items-center gap-9 px-7 py-6">
//                     {NavigationIcon.map((icon, key) =>
//                         <Link href={icon.slug} key={key} className="tooltip tooltip-right text-base-content before:bg-base-content/30 after:opacity-0" data-tip={icon.name}>
//                             <button className="btn btn-circle btn-ghost bg-base-content/30 w-[2.9rem] h-[2.9rem] min-h-[2rem]"  style={{filter:icon.slug == "/websites" ? "brightness(10)" : "brightness(1)"}} >
//                                 <icon.icon className="w-6 h-6" />
//                             </button>
//                         </Link>
//                     )}
//                 </div>
//     )
// }
// // side navigation -- [End]

// // 


export default function DashBoard() {
    return (
       <div className="text-base-content">Hi</div>
    )

}
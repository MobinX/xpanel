import { ForwardRefExoticComponent, ReactNode } from "react"

export const BgWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full h-full  flex flex-col justify-center items-center relative bg-base-100 text-base-content">
            <div className="w-full h-full absolute z-50 inset-0  flex justify-center items-center text-base-content " style={{ backdropFilter: "blur(290px) brightness(0.6)" , animation: "fadeIntoFadeOut 5s infinite"}}>
                {children} </div>
            <div className="top-0 left-0 absolute w-1/4 h-full rounded-full bg-yellow-600" style={{ animation: "leftToRsight 5s infinite" }}></div>
            <div className="top-0 left-1/4 absolute w-1/4 h-full rounded-full bg-purple-500" ></div>
            <div className="top-0 right-1/4 absolute w-1/4 h-full rounded-full bg-yellow-600"></div>
            <div className="top-0 right-0 absolute w-1/4 h-full rounded-full bg-purple-500" style={{ animation: "rightTosLeft 5s infinite" }}></div>

        </div>)
}

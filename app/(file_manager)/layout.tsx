
import { AppNav } from "../(dashboard)/components/AppNav";
import { BgWrapper } from "../(dashboard)/components/BgWrapper";
import { Breadcums } from "../(dashboard)/components/Breadcums";
import { SideBar } from "../(dashboard)/components/Sidebar";
import "../globals.css"

import { Search, Trash, PackagePlus, ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react";
import { FSManager } from "./components/FSManager";
import { ActionBar } from "./components/ActionBar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="w-full h-full ">
            <body className="w-full h-full">
                <BgWrapper>
                    <FSManager>
                        <div className="w-full h-full flex ">

                            <div className="flex flex-col md:px-8  py-4 px-4 gap-2 flex-1 w-full">
                                <ActionBar />

                                {children}
                            </div>
                        </div>
                    </FSManager>
                </BgWrapper>
            </body>
        </html>
    );
}

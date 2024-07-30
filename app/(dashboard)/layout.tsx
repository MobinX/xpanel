import { BgWrapper } from "./components/BgWrapper";
import { SideBar } from "./components/Sidebar";
import "../globals.css"
import { AppNav } from "./components/AppNav";
import { Breadcums } from "./components/Breadcums";
import { Search, Trash, PackagePlus, ArrowDownUp, ChevronLeft, ChevronRight } from "lucide-react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="w-full h-full ">
            <body className="w-full h-full">
                <BgWrapper>
                    <div className="w-full h-full flex ">
                        <SideBar />
                        <AppNav />
                        <div className="flex flex-col md:px-8  py-4 px-4 gap-2 flex-1 w-full">
                            <Breadcums />
                     
                            {children}
                        </div>
                    </div>
                </BgWrapper>
            </body>
        </html>
    );
}

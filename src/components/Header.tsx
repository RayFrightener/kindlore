"use client";
import { FiUpload } from "react-icons/fi";
import { useSession } from "next-auth/react";
import SignIn from "./sign-in";
import SignOut from "./sign-out";


export default function Header() {
    const { data: session, status } = useSession();
    
    return (
        <header className="w-full bg-[#867979] py-1 flex items-center justify between">
            <div className="flex-1"/>
            <h1 className="logo-header text-xl font-bold text-center flex-1">KINDLORE</h1>
            <div className="flex-1 flex justify-end pr-4 gap-4">
                <button className="  py-2 rounded font-semibold cursor-pointer"><FiUpload size={22}  /></button>
                
                { status === "loading" ? null : session?.user? (
                    <SignOut />
                ) : (
                    <SignIn />
                )}
            </div>
        </header>
    );
}
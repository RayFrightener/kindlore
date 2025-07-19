import { FiUpload } from "react-icons/fi";


export default function Header() {
    return (
        <header className="w-full bg-[#867979] py-1 flex items-center justify between">
            <div className="flex-1"/>
            <h1 className="logo-header text-xl font-bold text-center flex-1">KINDLORE</h1>
            <div className="flex-1 flex justify-end pr-4 gap-4">
                <button className="  py-2 rounded font-semibold cursor-pointer"><FiUpload size={22}  /></button>
                <button className="  py-2 rounded font-semibold cursor-pointer text-sm">Sign In</button>
            </div>
        </header>
    );
}
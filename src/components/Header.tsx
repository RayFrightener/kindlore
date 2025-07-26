"use client";
import { FiUpload } from "react-icons/fi";
import { useSession } from "next-auth/react";
import SignIn from "./sign-in";
import SignOut from "./sign-out";
import { useToast } from "@/utils/eternal/showToast";
import { protectedAction } from "@/utils/eternal/protectedAction";
import React, {useRef} from "react";
import { useEncryptionKey } from "@/components/EncryptionKeyContext";
import { encryptWithKey } from "@/utils/eternal/encryptionUtils";
import { parseClippings } from "@/utils/parseClippings";



export default function Header() {
    const { data: session, status } = useSession();
    const [toast, showToast] = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { encryptionKey } = useEncryptionKey();


    function handleUploadClick() {
        if (!protectedAction(session, showToast)) return;
        fileInputRef.current?.click();
    }
    
    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if(!file) return;

        //check file name
        if (file.name !== "My Clippings.txt") {
            showToast("Please upload your kindle My Clippings.txt file.");
            return
        }

        //read file text
        const text = await file.text();

        //check for delimeter and basic structure
        if (!text.includes("==========") || !text.match(/\(.+\)/)) {
            showToast("Invalid file format. Please upload a valid Kindle My Clippings.txt file.");
            return;
        }
        
        // Parse clippings
        const parsedBooks = parseClippings(text);

        // Encrypt each clipping, title, and author
        if (!encryptionKey) {
            showToast("Encryption key not available.");
            return;
        }
        
            const encryptedBooks = await Promise.all(parsedBooks.map(async (book) => {
            const encryptedTitle = await encryptWithKey(encryptionKey, book.title);
            const encryptedAuthor = await encryptWithKey(encryptionKey, book.author);
            const encryptedClippings = await Promise.all(book.clippings.map(async (clip) => ({
                ...clip,
                clipping: await encryptWithKey(encryptionKey, clip.clipping),
            })));
            return {
                title: encryptedTitle,
                author: encryptedAuthor,
                clippings: encryptedClippings,
            };
        }));

        // Send encrypted data to API
        try {
            // console.log("Encrypted books to upload:", JSON.stringify(encryptedBooks, null, 2));
            const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ books: encryptedBooks }),
        });
        if (!res.ok) {
            showToast("Upload failed. Please try again.");
            return;
        }
        showToast("Upload successful!");
        // Optionally handle response data here
        } catch (err) {
            showToast("Network error. Please try again.");
        }

    }
    return (
        <header className="w-full bg-[#867979] py-1 flex items-center justify between">
            <div className="flex-1"/>
            <h1 className="logo-header text-xl font-bold text-center flex-1">KINDLORE</h1>
            <div className="flex-1 flex justify-end pr-4 gap-4">
                <input
                    type="file"
                    accept=".txt"
                    ref={fileInputRef}
                    style={{ display: "none"}}
                    onChange={handleFileChange}
                />
                <button className="  py-2 rounded font-semibold cursor-pointer"
                onClick={handleUploadClick}
                >
                    <FiUpload size={22}  />
                </button>
                
                { status === "loading" ? null : session?.user? (
                    <SignOut />
                ) : (
                    <SignIn />
                )}
            </div>
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#222] text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
                    {toast}
                </div>
            )}
        </header>
    );
}

// // Send file to API
        // const formData = new FormData();
        // formData.append("file", file);
        
        // try {
        // const res = await fetch("/api/upload", {
        //     method: "POST",
        //     body: formData,
        // });
"use client";
//Component contains both title list and its content
/**If not signed in: show example books + clippings
 * if signed in: populate from the DB
 */

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useToast } from "@/utils/showToast";
import { useSession } from "next-auth/react";
import {protectedAction} from "@/utils/protectedAction";

//sample data for site visitors
export interface Clipping {
    id: number;
    time: string;
    date: string;
    clipping: string;
}
export type ClippingsDate = Record<string, Clipping[]>;
const clippingsData: ClippingsDate = {
  "Meditations - Marcus Aurelius": [
    {
      id: 1,
      time: "12:24:00 AM",
      date: "Tuesday, December 20, 2022",
      clipping: "You have power over your mind—not outside events. Realize this, and you will find strength."
    },
    {
      id: 2,
      time: "12:45:35 PM",
      date: "Tuesday, December 20, 2022",
      clipping: "Dwell on the beauty of life. Watch the stars, and see yourself running with them."
    },
    {
      id: 3,
      time: "10:42:00 AM",
      date: "Tuesday, December 20, 2022",
      clipping: "The impediment to action advances action. What stands in the way becomes the way."
    }
  ],

  "The Prophet - Kahlil Gibran": [
    {
      id: 1,
      time: "2:19:20 AM",
      date: "Tuesday, January 31, 2023",
      clipping: "Your pain is the breaking of the shell that encloses your understanding."
    },
    {
      id: 2,
      time: "1:50:51 AM",
      date: "Sunday, February 12, 2023",
      clipping: "Let there be spaces in your togetherness, and let the winds of the heavens dance between you."
    },
    {
      id: 3,
      time: "9:57:58 PM",
      date: "Friday, February 17, 2023",
      clipping: "You give but little when you give of your possessions. It is when you give of yourself that you truly give."
    }
  ],

  "Walden - Henry David Thoreau": [
    {
      id: 1,
      time: "12:52:04 PM",
      date: "Sunday, July 16, 2023",
      clipping: "I went to the woods because I wished to live deliberately, to front only the essential facts of life..."
    },
    {
      id: 2,
      time: "10:42:00 AM",
      date: "Monday, July 14, 2025",
      clipping: "The mass of men lead lives of quiet desperation."
    },
    {
      id: 3,
      time: "11:53:25 AM",
      date: "Monday, July 14, 2025",
      clipping: "Rather than love, than money, than fame, give me truth."
    }
  ],

  "Letters to a Young Poet - Rainer Maria Rilke": [
    {
      id: 1,
      time: "12:51:47 PM",
      date: "Wednesday, December 28, 2022",
      clipping: "Be patient toward all that is unsolved in your heart and try to love the questions themselves."
    },
    {
      id: 2,
      time: "11:57:49 PM",
      date: "Friday, December 30, 2022",
      clipping: "No feeling is final."
    }
  ]
};

//type def for component
interface BookListSideBarProps {
    books: string[];
    selectedBook: string;
    onSelect: (book: string) => void;
}

//Title List sidebar component
function TitleListSideBar({ books, selectedBook, onSelect}: BookListSideBarProps){

    return(
        <aside className="border-r border-[#AA9c9c]">
            <ul>
                {books.map((book) => (
                    <li
                        key={book}
                        className={`cursor-pointer p-2 ${selectedBook === book ? "bg-[#AA9C9C] text-gray-900" : "text-gray-900"}`}
                        onClick={() => onSelect(book)}
                        >
                            {book}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

//type def for component
interface BookContentProps {
    clippings?: Clipping[];
}

//parent component to manage title list and content
//based on selected title from the list on the left -> display title 
function Content({ clippings }: BookContentProps){
  const { data: session } = useSession();
  const [toast, showToast] = useToast();

  function handleProtectedAction() {
    if (!protectedAction(session, showToast)) return false; 
    return true;
  }
    if(!clippings) return <div className="p-4"> There are no clippings for this book!</div>
    return (
        <section className="w-full sm:w-[80vw]">
          {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#222] text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
                    {toast}
                </div>
            )}

            {clippings.map((clip) => (
                <div key={clip.id} className="pt-4 pl-4 pr-4 pb-2">
                    <div className="text-xs pb-1"> {clip.id}. {clip.date} {clip.time} </div>
                    <div className="text-lg">{clip.clipping}</div>
                    <button
                        className="mt-2 mb-1 bg-[#B8ACAC] px-2 py-1 rounded cursor-pointer"
                        onClick={handleProtectedAction}
                    >
                        Add note
                    </button>
                    <textarea
                        className="w-full p-2 border border-[#AA9C9C] focus:outline-none focus:ring-2 focus:ring-[#AA9C9C]"
                        placeholder="Please write your notes/reflections here"
                        onChange={(e) => e.target.value}
                        />
                    <button className="pt-2 cursor-pointer"
                    onClick={handleProtectedAction}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            ))}
        </section>
    );
}

//parent component that handles BookListBar + BookContent layout and props
export default function ContentComponent(){
    const books = Object.keys(clippingsData)
    const [selectedBook, setSelectedBook] = useState(books[0])

    return(
        <div className="grid grid-cols-1 sm:grid-cols-[20%_80%] min-h-screen">
            <TitleListSideBar books={books} selectedBook={selectedBook} onSelect={setSelectedBook} />
            <Content clippings={clippingsData[selectedBook]}/>
        </div>
    );
}


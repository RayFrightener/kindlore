import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useEncryptionKey } from "./EncryptionKeyContext";
import {
  encryptWithKey,
  decryptWithKey,
} from "@/utils/eternal/encryptionUtils";
import { ImBin } from "react-icons/im";

export default function ClippingReflection({
  clippingId,
}: {
  clippingId: string;
}) {
  const [reflections, setReflections] = useState<
    { id: string; text: string }[]
  >([]);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const { encryptionKey } = useEncryptionKey();
  // Fetch and decrypt reflections on mount or when clippingId/encryptionKey changes
  // useEffect(() => {
  //   if (!encryptionKey || !clippingId) return;
  //   fetch(`/api/reflection?clippingId=${clippingId}`)
  //     .then((res) => res.json())
  //     .then(async (data) => {
  //       if (data.reflections) {
  //         const decrypted = await Promise.all(
  //           data.reflections.map(async (r: any) => ({
  //             id: r.id,
  //             text: await decryptWithKey(encryptionKey, r.text, r.iv),
  //           }))
  //         );
  //         setReflections(decrypted);
  //       }
  //     });
  // }, [clippingId, encryptionKey]);

  // Show input when Add note is clicked
  const handleAddNote = () => {
    setShowInput(true);
    setInput("");
  };

  const handleSend = async () => {
    if (!input.trim() || !encryptionKey) return;
    const { cipherText, iv } = await encryptWithKey(encryptionKey, input);
    await fetch("/api/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clippingId, text: cipherText, iv }),
    });
    setInput("");
    setShowInput(false);
    // Refetch reflections to get the new one with correct id and decrypted text
    fetchReflections();
  };

  // Helper to fetch and decrypt reflections
  const fetchReflections = async () => {
    if (!encryptionKey || !clippingId) return;
    const res = await fetch(`/api/reflection?clippingId=${clippingId}`);
    const data = await res.json();
    if (data.reflections) {
      const decrypted = await Promise.all(
        data.reflections.map(async (r: any) => ({
          id: r.id,
          text: await decryptWithKey(encryptionKey, r.text, r.iv),
        }))
      );
      setReflections(decrypted);
    }
  };

  // Use fetchReflections in useEffect
  useEffect(() => {
    fetchReflections();
  }, [clippingId, encryptionKey]);

  const handleDelete = async (id: string) => {
    await fetch(`/api/reflection?id=${id}`, { method: "DELETE" });
    setReflections(reflections.filter((r) => r.id !== id));
  };

  return (
    <div>
      {/* Show reflections */}
      {reflections.map((r) => (
        <div
          key={r.id}
          className="my-2 p-3 bg-[#ECE9E6] border border-[#AA9C9C] rounded-lg text-gray-800 shadow-sm flex items-center justify-between"
        >
          <div className="pl-1 text-sm break-words">{r.text}</div>
          <button
            className="ml-2 cursor-pointer hover:text-red-800"
            onClick={() => handleDelete(r.id)}
            title="Delete reflection"
          >
            <ImBin />
          </button>
        </div>
      ))}
      {/* Show Add note button if not showing input */}
      {!showInput && (
        <button
          className="mt-2 mb-1 bg-[#B8ACAC] px-2 py-1 rounded cursor-pointer"
          onClick={handleAddNote}
        >
          Add note
        </button>
      )}
      {/* Show input and send button */}
      {showInput && (
        <div className="my-2">
          <textarea
            className="w-full p-2 border border-[#AA9C9C] focus:outline-none focus:ring-2 focus:ring-[#AA9C9C] rounded"
            placeholder="Please write your notes/reflections here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button className="p-2 cursor-pointer" onClick={handleSend}>
            <FaPaperPlane />
          </button>
        </div>
      )}
    </div>
  );
}

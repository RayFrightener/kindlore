import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ClippingReflection({ onSend }: { onSend?: (text: string) => void }) {
  const [reflections, setReflections] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");

  // Show input when Add note is clicked
  const handleAddNote = () => {
    setShowInput(true);
    setInput("");
  };

  // Handle send
  const handleSend = () => {
    if (input.trim()) {
      setReflections([...reflections, input]);
      if (onSend) onSend(input);
      setShowInput(false);
      setInput("");
    }
  };

  return (
    <div>
      {/* Show reflections */}
      {reflections.map((text, idx) => (
        <div
            key={idx}
            className="my-2 p-3 bg-[#ECE9E6] border border-[#AA9C9C] rounded-lg text-gray-800 shadow-sm"
        >
            <div className="pl-1 text-sm">{text}</div>
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
            onChange={e => setInput(e.target.value)}
          />
          <button
            className="p-2 cursor-pointer"
            onClick={handleSend}
          >
            <FaPaperPlane />
          </button>
        </div>
      )}
    </div>
  );
}
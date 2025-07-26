import { useState } from "react";

interface PasswordModalProps {
  isFirstTime: boolean;
  onSubmit: (password: string) => void;
}

export default function PasswordModal({ isFirstTime, onSubmit }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isFirstTime && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    // console.log("Password entered:", `"${password}"`, "length:", password.length);
    onSubmit(password);
  }

  return (
    <div className="fixed inset-0 bg-[#C7BEBE] bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-[#F5F3F3] rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2 text-center">
          {isFirstTime ? "Set Your Encryption Password" : "Unlock Your Data"}
        </h2>
        <p className="text-sm text-gray-700 mb-4 text-center">
          {isFirstTime ? (
            <>
              Your data is <span className="font-semibold">end-to-end encrypted</span>. This means only you can view your books, highlights, and reflections—no one else, not even Kindlore. <br />
              Please set a password to protect your privacy. <br />
              <span className="font-semibold text-red-700">If you forget your password, your data cannot be recovered.</span> <br />
              Store your password somewhere safe.
            </>
          ) : (
            <>
              Enter your encryption password to unlock your private data. <br />
              <span className="font-semibold text-red-700">Only you can decrypt your information. If you forget your password, your data cannot be recovered.</span>
            </>
          )}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border border-[#AA9C9C] rounded focus:outline-none focus:ring-2 focus:ring-[#AA9C9C]"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          {isFirstTime && (
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border border-[#AA9C9C] rounded focus:outline-none focus:ring-2 focus:ring-[#AA9C9C]"
              placeholder="Confirm password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          )}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((v) => !v)}
            />
            Show password
          </label>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="bg-[#B8ACAC] text-gray-900 px-4 py-2 rounded font-semibold mt-2 hover:bg-[#AA9C9C] transition cursor-pointer"
          >
            {isFirstTime ? "Set Password" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

                    
                    // <button className="pt-2 cursor-pointer"
                    //                     onClick={handleProtectedAction}
                    //                     >
                    //                         <FaPaperPlane />
                    // <div>border-r border-[#AA9c9c]</div>
                    // <button
                    //     className="mt-2 mb-1 bg-[#B8ACAC] px-2 py-1 rounded cursor-pointer"
                    //     onClick={handleProtectedAction}
                    // >
                    //     Add note
                    // </button>
                    // <textarea
                    //     className="w-full p-2 border border-[#AA9C9C] focus:outline-none focus:ring-2 focus:ring-[#AA9C9C]"
                    //     placeholder="Enter password here"
                    //     onChange={(e) => e.target.value}
                    //     />
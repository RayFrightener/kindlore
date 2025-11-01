"use client";
import { useState } from "react";
import { useToast } from "@/utils/eternal/showToast";

export default function FeedbackForm() {
  const [toast, showToast] = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    heardFrom: "",
    heardFromOther: "",
    expectedToDo: "",
    confusedOrDidntWork: "",
    wouldUseAgain: "",
    wouldUseAgainWhy: "",
    emailForUpdates: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      showToast("Thank you for your feedback! 🙏");
      setIsOpen(false);

      // Reset form
      setFormData({
        heardFrom: "",
        heardFromOther: "",
        expectedToDo: "",
        confusedOrDidntWork: "",
        wouldUseAgain: "",
        wouldUseAgainWhy: "",
        emailForUpdates: "",
      });
    } catch {
      showToast("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 px-4 py-2 bg-[#B8ACAC] hover:bg-[#AA9C9C] text-gray-900 rounded font-semibold transition cursor-pointer"
      >
        Share Feedback
      </button>
    );
  }

  return (
    <div className="mt-6 border border-[#AA9C9C] rounded-lg p-6 bg-[#F5F3F3]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Share Your Feedback</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-600 hover:text-gray-900 text-2xl leading-none cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* How did you hear about it? */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            How did you hear about Kindlore?{" "}
            <span className="text-gray-500">(optional)</span>
          </label>
          <select
            value={formData.heardFrom}
            onChange={(e) =>
              setFormData({ ...formData, heardFrom: e.target.value })
            }
            className="w-full p-2 border border-[#AA9C9C] rounded focus:outline-none focus:ring-2 focus:ring-[#AA9C9C] text-gray-900 bg-white"
          >
            <option value="">Select one...</option>
            <option value="reddit">Reddit</option>
            <option value="discord">Discord</option>
            <option value="other">Other</option>
          </select>
          {formData.heardFrom === "other" && (
            <input
              type="text"
              placeholder="Please specify..."
              value={formData.heardFromOther}
              onChange={(e) =>
                setFormData({ ...formData, heardFromOther: e.target.value })
              }
              className="w-full mt-2 p-2 border border-[#AA9C9C] rounded focus:outline-none focus:ring-2 focus:ring-[#AA9C9C] text-gray-900"
            />
          )}
        </div>

        {/* What did you expect it to do? */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            What did you expect it to do?{" "}
            <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            value={formData.expectedToDo}
            onChange={(e) =>
              setFormData({ ...formData, expectedToDo: e.target.value })
            }
            placeholder="Tell us what you were expecting..."
            rows={3}
            className="w-full p-2 border border-[#AA9C9C] rounded focus:outline-none focus:ring-2 focus:ring-[#AA9C9C] text-gray-900 resize-none"
          />
        </div>

        {/* What confused or didn't work? */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            What confused or didn&apos;t work?{" "}
            <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            value={formData.confusedOrDidntWork}
            onChange={(e) =>
              setFormData({ ...formData, confusedOrDidntWork: e.target.value })
            }
            placeholder="Help us improve by sharing what was unclear or broken..."
            rows={3}
            className="w-full p-2 border border-[#AA9C9C] rounded focus:outline-none focus:ring-2 focus:ring-[#AA9C9C] text-gray-900 resize-none"
          />
        </div>

        {/* Would you use it again? */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Would you use it again?{" "}
            <span className="text-gray-500">(optional)</span>
          </label>
          <select
            value={formData.wouldUseAgain}
            onChange={(e) =>
              setFormData({ ...formData, wouldUseAgain: e.target.value })
            }
            className="w-full p-2 border border-[#AA9C9C] rounded focus:outline-none focus:ring-2 focus:ring-[#AA9C9C] text-gray-900 bg-white"
          >
            <option value="">Select one...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {formData.wouldUseAgain && (
            <textarea
              value={formData.wouldUseAgainWhy}
              onChange={(e) =>
                setFormData({ ...formData, wouldUseAgainWhy: e.target.value })
              }
              placeholder="Why? (optional)"
              rows={2}
              className="w-full mt-2 p-2 border border-[#AA9C9C] rounded focus:outline-none focus:ring-2 focus:ring-[#AA9C9C] text-gray-900 resize-none"
            />
          )}
        </div>

        {/* Email for updates */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            (Optional) Email for early features
          </label>
          <input
            type="email"
            value={formData.emailForUpdates}
            onChange={(e) =>
              setFormData({ ...formData, emailForUpdates: e.target.value })
            }
            placeholder="your.email@example.com"
            className="w-full p-2 border border-[#AA9C9C] rounded focus:outline-none focus:ring-2 focus:ring-[#AA9C9C] text-gray-900"
          />
        </div>

        {/* Submit button */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#B8ACAC] hover:bg-[#AA9C9C] text-gray-900 rounded font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-[#AA9C9C] text-gray-900 rounded font-semibold hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#222] text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

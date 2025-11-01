import Link from "next/link";
import FeedbackForm from "@/components/FeedbackForm";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-opacity-90 rounded-lg text-gray-900">
      <h1 className="text-2xl font-bold mb-4">About Kindlore</h1>
      <p className="mb-4">
        <span className="font-semibold">Kindlore</span> helps you organize and
        reflect on your Kindle highlights. Simply upload your{" "}
        <span className="font-mono px-1 rounded">My Clippings.txt</span> file,
        and Kindlore will automatically sort your highlights by book, making it
        easy to browse and add personal reflections to each one.
      </p>
      <p className="mb-4">
        <span className="font-semibold">How to find your file:</span> Connect
        your Kindle to your computer, then navigate to{" "}
        <span className="font-mono px-1 rounded">
          /documents/My Clippings.txt
        </span>
        . Upload this file to Kindlore, and the app will process and organize
        your highlights for you.
      </p>
      <p className="mb-4">
        <span className="font-semibold">Your privacy matters:</span> All your
        data, including highlights and reflections, is{" "}
        <span className="font-semibold">end-to-end encrypted</span>. Only you
        can decrypt your information using the password you set at first
        sign-in.{" "}
        <span className="text-red-700 font-semibold">
          If you forget your password, your data cannot be recovered.
        </span>
      </p>
      <p className="mb-4">
        Ready to get started?{" "}
        <Link href="/" className="text-blue-700 underline hover:text-blue-900">
          Go to the homepage
        </Link>
        .
      </p>
      <p className="mb-2">
        <span className="font-semibold">Contact:</span> If you have questions,
        feedback, or need support, please use the feedback form below.
      </p>
      <div className="mt-8 pt-6 border-t border-[#AA9C9C]">
        <FeedbackForm />
      </div>
    </div>
  );
}

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import notFound from "@/public/images/404_not_found.webp"

export default function NotFound() {
  return (
    <main
      className="min-h-[80vh] flex flex-col items-center justify-center text-white p-6 relative text-center animate-fadeIn"
    >
      <div className="">
        <Image
          className="w-40 h-40 sm:w-64 sm:h-64 object-cover"
          src={notFound.src}
          width={320}
          height={320}
          alt="Plant hero image"
          priority
        />
      </div>

      <p className="text-lg text-gray-800">
        {"Oops! The page you're looking for doesn't exist."}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        {"It might have been removed, renamed, or never existed."}
      </p>

      <Button
        variant="default"
        className="btn-primary mt-8 p-5"
      >
        <Link href="/">
          Go Back Home
        </Link>
      </Button>
    </main >
  );
}
import SadFace from "./svg/sadFace";
import Link from "next/link";

/**
 * NotFound component that displays a full-screen message indicating a page is not available.
 * It includes a SadFace icon and provides a link to return to the index (home) page.
 */
export default function NotFound() {
  return (
    // Full-screen container centering the content
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <SadFace className="h-56" /> {/* Display the SadFace icon */}
      <div className=" text-center max-w-xs md:max-w-none">
        {/* Message informing the user that the page is not available */}
        <p className="text-xl md:text-2xl">
          Sorry, this page is not available.
        </p>
        <p className="text-xl md:text-2xl">
          Go back to:
          <Link href="/" className="ml-2 underline hover:text-red-900">
            Index
          </Link>
        </p>
      </div>
    </div>
  );
}

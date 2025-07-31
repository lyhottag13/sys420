import Link from "next/link";
import { useSpecificationsStore } from "../../store/specificationsContext";
import { useUserStore } from "../../store/userContext";

/**
 * Component for the Specifications Navbar that provides navigation links for specifications features.
 *
 * @function SpecificationsNavbar
 * @returns {JSX.Element} JSX representing the Specifications Navbar.
 */

export default function SpecificationsNavbar() {
  const { specifications } = useSpecificationsStore();
  const { user } = useUserStore();

  return (
    <>
      {
        specifications.pn && 
          <Link href={{ pathname: "/specifications/viewSpecs" }} className="w-full py-3 px-4 semibold hover:cursor-pointer hover:text-white hover:bg-red-900 lg:w-auto lg:text-white lg:py-4 lg:px-5 lg:hover:text-white lg:hover:bg-red-800 lg:text-2xl">
              View Specifications
          </Link>
      }
      {
        (user.user_type == "ADMIN" || user.user_type == "admin") &&
        <>
          {
            specifications.pn && 
            <>
              <Link href={{ pathname: "/specifications/updateSpecs" }} className="w-full py-3 px-4 semibold hover:cursor-pointer hover:text-white hover:bg-red-900 lg:w-auto lg:text-white lg:py-4 lg:px-5 lg:hover:text-white lg:hover:bg-red-800 lg:text-2xl">
                  Update Specifications
              </Link>
            </>
          }
          
        </>
      }
      <Link href={{ pathname: "/specifications/filter" }} className="w-full py-3 px-4 semibold hover:cursor-pointer hover:text-white hover:bg-red-900 lg:w-auto lg:text-white lg:py-4 lg:px-5 lg:hover:text-white lg:hover:bg-red-800 lg:text-2xl">
          Filter
      </Link>

      <Link href={{ pathname: "/specifications/createSpecs" }} className="w-full py-3 px-4 semibold hover:cursor-pointer hover:text-white hover:bg-red-900 lg:w-auto lg:text-white lg:py-4 lg:px-5 lg:hover:text-white lg:hover:bg-red-800 lg:text-2xl">
              Create Specifications
      </Link>


    </>
  );
}

import Link from "next/link";
import { useRouter } from "next/router";
import { useUserStore } from "../../store/userContext";

import UserIcon from "../svg/userIcon";
/**
 * Component for the User Menu that provides user-related navigation links.
 *
 * @function UserMenu
 * @returns {JSX.Element} JSX representing the User Menu.
 */

export default function UserMenu(){
    const { user, logout } = useUserStore();
    const router = useRouter();

    /**
   * Handles the logout process.
   *
   * @param {Event} e - The click event.
   */
    const logOutHandler = (e) => {
        e.preventDefault();
        logout();
        router.push('/');
    }

    return(
        <div className="group w-full flex flex-col justify-center relative hover:bg-red-800 lg:w-auto">
            <UserIcon className="hidden lg:block w-12 fill-current text-white transform group-hover:scale-105 hover:cursor-pointer"/>
            <nav className="flex flex-col w-full lg:w-auto lg:hidden lg:group-hover:flex lg:z-20 lg:text-center lg:absolute lg:right-0 lg:top-0  lg:max-w-none lg:bg-red-900 lg:text-xl lg:p-1 lg:mt-16 lg:border">
                {
                    user.username?
                    <a onClick={logOutHandler} className="px-4 hover:cursor-pointer lg:text-white  py-2 lg:px-3 w-full lg:hover:bg-white lg:hover:text-black whitespace-nowrap">
                        Log Out
                    </a>
                    :
                    <Link href = {{ pathname: "/login", query: { lastPath:  router.pathname == "/login"? router.query.lastPath : router.pathname } }} className="px-4 hover:cursor-pointer lg:text-white  py-2 lg:px-3 w-full lg:hover:bg-white lg:hover:text-black whitespace-nowrap">
                            Log In
                    </Link>
                }
                {
                    ( user.user_type == "ADMIN" || user.user_type == "admin" ) &&
                    <Link href="/createUser" className="hover:cursor-pointer lg:text-white  py-2 px-3 w-full lg:hover:bg-white lg:hover:text-black whitespace-nowrap">
                            Create User
                    </Link>
                }
            </nav>
        </div>
    );
}
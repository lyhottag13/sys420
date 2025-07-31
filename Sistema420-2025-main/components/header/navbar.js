import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

/**
 * Component for the Reporting Navbar that provides navigation links for reporting features.
 *
 * @function ReportingNavbar
 * @returns {JSX.Element} JSX representing the Reporting Navbar.
 */

import ReportingNavbar from "./reportingNavbar";
import SpecificationsNavbar from "./specificationsNavbar";
import UserMenu from "./userMenu";

import CloseIcon from "../svg/closeIcon";
import MenuIcon from "../svg/menuIcon";

export default function Navbar() {
  const router = useRouter();

  const [ isOpen, setIsOpen ] = useState(false);
  
  const onClickHandler = (e) => {
    e.preventDefault();

    setIsOpen(!isOpen);
  }

  return (
    <div className=" w-full flex bg-red-900 justify-center">
      <div className="hidden lg:flex items-center w-full max-w-7xl justify-between">
        <nav className="flex flex-row w-auto max-w-none">
            { 
                router.pathname.slice(1,10) == "reporting"
                &&
                <ReportingNavbar />
            }
            { 
                router.pathname.slice(1,15) == "specifications"
                &&
                <SpecificationsNavbar />
            }
        </nav>

        <nav className="flex flex-row w-auto max-w-none">
            <UserMenu />
            <Link href={{ pathname: "/" }} className="text-md lg:ml-auto lg:text-2xl text-white py-4 px-5 hover:bg-red-800">
                Home
            </Link>
        </nav>
        
      </div>
      <div className="flex flex-col lg:hidden">
            <div className="py-1" onClick={onClickHandler}>
                <MenuIcon className="text-white stroke-current w-9 hover:cursor-pointer transform hover:scale-105"/>   
            </div>
            <div className={`transition-all flex justify-center items-center h-screen w-screen top-0 left-0 fixed transform bg-black bg-opacity-10 z-50 ${isOpen? "" : "scale-0"}`}>
                <div className={`flex flex-col items-center py-7 bg-white w-5/6 h-5/6 rounded-lg text-xl relative`}>
                    
                    <div className="absolute right-3 top-3 " onClick={onClickHandler}>
                        <CloseIcon className="w-6 stroke-current text-black hover:text-red-500 hover:cursor-pointer"/>
                    </div>

                    <h2 className="font-bold">System 420</h2>

                    <nav className="flex flex-col w-full max-w-7xl justify-end items-center">
                        { 
                            router.pathname.slice(1,10) == "reporting"
                            &&
                            <ReportingNavbar />
                        }
                        { 
                            router.pathname.slice(1,15) == "specifications"
                            &&
                            <SpecificationsNavbar />
                        }
                    </nav>
                    <nav className="flex flex-col w-full max-w-7xl justify-end items-center">
                        <UserMenu />
                        <Link href={{ pathname: "/" }} className="w-full py-3 px-4 semibold hover:cursor-pointer hover:text-white hover:bg-red-900 ">
                            Home
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    </div>
  );
}

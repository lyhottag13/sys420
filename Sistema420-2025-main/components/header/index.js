import Clock from './clock';
import Link from 'next/link';
import Navbar from './navbar';

/**
 * Header component that contains a logo, current time, and navigation bar.
 *
 * @function Header
 * @returns {JSX.Element} JSX representing the header.
 */

export default function Header() {
  
  return (
    <div className="flex flex-col w-full border-b-2 border-gray-300 lg:border-0 items-center">
      <div className="flex justify-center lg:justify-between align-center pt-5 pb-8 w-full max-w-7xl px-2">
        <div>
          {
            
            <Link href="/" legacyBehavior>
              <a><img src="/images/cotoLogoHeader.png" alt="Coto Logo"/></a>
            </Link>
          }
        </div>
        <div className="hidden lg:flex flex-col justify-end text-5xl">
          <Clock/>
        </div>
      </div>

      <Navbar />
      
    </div>
  )
}

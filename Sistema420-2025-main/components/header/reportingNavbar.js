import { useTestsStore } from "../../store/testsContext";
import Link from "next/link";

/**
 * Component for the Reporting Navbar that provides navigation links for reporting features.
 *
 * @function ReportingNavbar
 * @returns {JSX.Element} JSX representing the Reporting Navbar.
 */

export default function ReportingNavbar(){
  const { currentSearch } = useTestsStore();

  const linkClass = "w-full py-3 px-4 semibold hover:cursor-pointer hover:text-white hover:bg-red-900 lg:w-auto lg:text-white lg:py-4 lg:px-5 lg:hover:text-white lg:hover:bg-red-800 lg:text-2xl";

  return (
    <>
      {currentSearch.selectedTest && (
        <>
          <Link href="/reporting/summary" className={linkClass}>Test Summary</Link>
          <Link href="/reporting/pareto" className={linkClass}>Pareto Failure Analysis</Link>
          <Link href="/reporting/charts" className={linkClass}>Charts</Link>
          <Link href="/reporting/tables" className={linkClass}>Raw Data</Link>
        </>
      )}
      <Link href="/reporting/filter" className={linkClass}>Filter</Link>
    </>
  );
}

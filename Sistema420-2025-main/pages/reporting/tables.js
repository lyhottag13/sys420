import Head from "next/head";
import React from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";

import TestSelector from "../../components/testSelector";
import NotFound from "../../components/notFound";
import PrintResume from '../../components/print/reporting/printResume';

import { useTestsStore } from "../../store/testsContext";


import regeneratorRuntime from "regenerator-runtime";
import {
  useTable,
  useFilters,
  usePagination,
  useAsyncDebounce,
} from "react-table";

//Declaration of constants names
const testTypeFullName = {
  CRS: "Coil Resistance",
  DIO: "Diode",
  IRS: "Insulation Resistance",
  KEL: "Kelvin",
  SHO: "Shorts",
  OVT: "Operate Voltage",
  RVT: "Release Voltage",
  OCU: "Operate Current",
  RCU: "Release Current",
  VTD: "Voltage Differential",
  VTR: "Voltage Ratio",
  ATM: "Actuate Time",
  OTM: "Operate Time",
  RTM: "Release Time",
  TTM: "Transfer Time",
  SCR: "Static Contact Resistance",
  SCS: "Contact Resistance Stability",
  DCR: "Dynamic Contact Resistance",
  DCP: "Dynamic CR PkToPk"
};


/**
 * Renders an input field used for filtering table data.
 * 
 * @param {Object} props - Props for configuring the filter.
 * @param {function} props.setFilter - Function to set the filter state.
 * @param {Array} props.preFilteredRows - Rows available before filtering.
 * @param {any} props.filterValue - Current value of the filter.
 * @returns {JSX.Element} An input element for data filtering.
 */
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, id },
}) {
  const count = preFilteredRows.length;

  const handleChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 50);

  return (
    <input
      className="text-center outline-none mb-2 border-b border-white focus:border-blue-500"
      value={filterValue || ""}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={`Search ${count} records...`}
    />
  );
}

/**
 * The Tables component displaying raw data of selected tests with pagination and filtering.
 * 
 * It uses the 'useTestsStore' hook to access the currently selected test and its results,
 * and utilizes 'useTable', 'useFilters', and 'usePagination' hooks from React Table library
 * to provide an interactive data table. If no test is selected, it renders the NotFound component.
 * 
 * @returns {JSX.Element} The Tables component structure including head, header, test selector, table with data, pagination controls, and footer.
 */
export default function Tables() {
  const { currentSearch } = useTestsStore();

  if (!currentSearch.selectedTest) return <NotFound />;

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  )
  const columns = React.useMemo(
    () => [
      // {
      //   Header: "Test ID",
      //   accessor: "test_id",
      // },
      {
        Header: "DUT No",
        accessor: "dut_no",
      },
      {
        Header: "Test Type",
        accessor: "test_type",
        Cell: ({ value }) => testTypeFullName[value] || value,
        filter: 'includesFullName'
      },
      {
        Header: "Switch",
        accessor: "switch",
      },
      {
        Header: "Result",
        accessor: "result",
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: ({ value }) => {
          return typeof value === 'number' ? value.toFixed(2) : value;
        }
      },
    ],
    []
  );

  const filterTypes = React.useMemo(
    () => ({
      includesFullName: (rows, id, filterValue) => {
        return rows.filter(row => {
          const cellValue = row.values[id];
          const fullName = testTypeFullName[cellValue] || cellValue;
          return fullName.toLowerCase().includes(filterValue.toLowerCase());
        });
      },
    }),
    []
  );

  // Use the useTable hook to create table instance
  const tableInstance = useTable({columns, data: currentSearch.selectedTest.test_result, defaultColumn, filterTypes},useFilters,usePagination)
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    gotoPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableInstance

  // Render the Tables component structure
  return (
    <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
      <Head>
        <title>SYSTEM 420 - Raw Data</title>
        <link rel="icon" href="/icon.ico" />
        <link rel="stylesheet" href="../tailwind.css" />
      </Head>

      <Header />

      <div className="w-full pt-8 pb-5 border-b-2 border-t-2 border-gray-300 text-center">
        <h2 className="text-4xl">Raw Data</h2>
      </div>

      <TestSelector />

      <main className="flex-grow flex flex-col w-full justify-center items-center px-1 py-8">
        <div className="w-full lg:max-w-5xl flex overflow-x-scroll lg:overflow-x-auto">
          <table className="w-full text-center" {...getTableProps()}>
            <thead className="border-b border-black">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                      <div>
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="border-b border-black" {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="w-full lg:max-w-5xl flex items-center justify-end py-4 ">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19L4 12L11 5M19 19L12 12L19 5"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L16 12L9 19"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 5L20 12L13 19M5 5L12 12L5 19"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>{" "}
          <span className="ml-3">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
        </div>
      </main>

      <Footer />
      <PrintResume selectedTest={currentSearch.selectedTest} testsArray={currentSearch.tests}/>
    </div>
  );
}

import React from 'react';
import Head from 'next/head';
import Header from "../../components/header";
import Footer from "../../components/footer";
import TestSelector from "../../components/testSelector";
import NotFound from "../../components/notFound";
import PrintResume from '../../components/print/reporting/printResume';
import ParetoChart from '../../components/pareto/paretoChart';

import { testsViewParameters } from '../../constants/index'
import { useTestsStore } from "../../store/testsContext";

// Table
import regeneratorRuntime from "regenerator-runtime";
import {useTable, useGlobalFilter, useAsyncDebounce} from 'react-table';
import next from 'next';


/**
 * GlobalFilter component for filtering table data globally.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.preGlobalFilteredRows - Rows that are pre-filtered globally.
 * @param {Function} props.setGlobalFilter - Function to set the global filter.
 * @param {any} props.globalFilter - The current global filter state.
 * @returns {JSX.Element} The global filter input element.
 */
function GlobalFilter({preGlobalFilteredRows,globalFilter,setGlobalFilter}) {

  // State and handler for the global filter input
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200);

  // Render the global filter input field
  return (
    <div className="flex space-x-3">
      <p>Search:</p>
      <input 
        className="border border-black rounded focus:border-blue-500 text-lg bg-transparent w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none" type="text"
        value={value || ""} 
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }} 
        
      />
    </div>
  )
}


/**
 * Pareto component to display Pareto charts and a filterable table of test results.
 * 
 * Renders a Pareto chart based on the selected test's results, using a useMemo hook to calculate
 * data points from the selected test's results. It uses the react-table library to render a table
 * of test result data, which can be filtered using a global filter.
 * 
 * @returns {JSX.Element} The Pareto page component, which includes a header, a test selector, 
 * a filterable table of test results, a Pareto chart, and a footer.
 */
export default function Pareto() {
  const { currentSearch } = useTestsStore();

  // Return NotFound component if no test is selected
  if(!currentSearch.selectedTest) return <NotFound/>;

  // Memoize data calculation for efficiency
  const data = React.useMemo(()=>{
    let last_dut_no = -1;
    let last_test_type = -1;
    let last_failed = false;
    let objectData = {};

    // Calculate fail counts by test type
    for(let { dut_no, test_type, result } of currentSearch.selectedTest.test_result){
      if(last_failed && last_dut_no == dut_no) continue;
      if(!objectData[test_type]) objectData[test_type] = 0;

      last_dut_no = dut_no;
      last_test_type = test_type;
      last_failed = result != "PASS";

      if(last_failed) objectData[test_type]++;
    }

    // Map object data to array and calculate percentage
    return Object.entries(objectData).map(([f, q])=> ({ key: f, fail: testsViewParameters[f].name, quantity: q, percentage: ((q * 100 / currentSearch.selectedTest.relays_tested).toFixed(2)) + "%" })).sort((a, b) => b.quantity - a.quantity);
  }, [currentSearch])

  // Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: 'Fail',
        accessor: 'fail',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Percentage',
        accessor: 'percentage',
      },
    ],
    []
  )
  
  // Initialize table instance with data and global filter
  const tableInstance = useTable({ columns, data }, useGlobalFilter);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = tableInstance


  // Render Pareto component layout
  return (
    <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
      <Head>
        <title>SYSTEM 420 - Pareto</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <Header />
      <main className="w-full flex flex-col items-center flex-grow">
        <div className="w-full pt-8 pb-5 border-b-2 border-gray-300 text-center">
          <h2 className="text-4xl">Pareto</h2>
        </div>

        <TestSelector/>
        <div className="w-full flex flex-col items-center px-3 my-5">
          <div className="w-full flex flex-col lg:flex-row items-center px-3 justify-between mb-7 space-y-4 max-w-5xl">
              <p>Quantity of tested pieces: {currentSearch.selectedTest.relays_tested}</p>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
          </div>
          <div className="w-full max-w-5xl px-6 flex justify-center">
            <table {...getTableProps()} className="w-full text-center">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th className="border-b border-black">
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="border-b border-black">
                {rows.map((row, index) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()} key={`row-${index}`}>
                      {row.cells.map((cell, index2) => {
                        return (
                          <td key={`cell-${index}-${index2}`} {...cell.getCellProps()} className={`${index%2 == 0? 'bg-gray-100' : ''} p-4 border-t border-gray-300`}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className='w-full max-w-xs sm:max-w-md md:max-w-2xl mb-7'>
          <ParetoChart selectedTest={currentSearch.selectedTest}/>
        </div>
      </main>
      <Footer />
      <PrintResume selectedTest={currentSearch.selectedTest} testsArray={currentSearch.tests}/>

      
    </div>
  )
}
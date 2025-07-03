import { useState, useRef, useEffect } from 'react';
import ExcelJS from 'exceljs';
import CloseIcon from "../../svg/closeIcon";
import RightArrowIcon from "../../svg/rightArrowIcon";
import { testsViewParameters } from '../../../constants/index';

/**
* PrintOptions Component
* Provides a UI for users to select options for printing or exporting test results.
* Users can select specific tests to include, choose content areas for the summary,
* and decide whether to include failed pieces in the output.
* @exports
* @param {Function} setPrePrinting - Function to update pre-printing state.
* @param {Function} setPrinting - Function to update printing state.
* @param {boolean} isUnique - Flag to indicate if the test selection should be unique.
* @param {Object} options - Object containing current options for printing/exporting.
* @param {Function} setOptions - Function to update the options state.
* @returns {JSX.Element} A div container with nested interactive elements for configuring print/export options.
*/
export default function PrintOptions({ setPrePrinting, setPrinting, isUnique, options, setOptions, printing }) {

  const selectedTestsRef = useRef(null);
  const test_histogramas_pdf = useRef(null);
  const nonSelectedTestsRef = useRef(null);
  const [email, setEmail] = useState('');

  //Handles closing the print options menu.
  const closeHandler = (e) => {
    e.preventDefault();
    setPrePrinting(false);
  };

  useEffect(() => {
    if (printing && options.excel_format) {
      generateAndSendExcel();
    }
  }, [printing, options.excel_format]);

  const generateExcelBuffer = async (selectedTests) => {
    const workbook = new ExcelJS.Workbook();

    if (Array.isArray(selectedTests)) {
      for (const test of selectedTests) {
        const { headers, data } = getRawDataTable(test);

        const worksheet = workbook.addWorksheet(`Test ${test.id}`);
        worksheet.addRow(headers);
        data.forEach((row) => {
          worksheet.addRow(row);
        });
      }

      // Devuelve un buffer en formato array para enviar por email
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } else {
      console.error('No tests selected or tests data is not an array');
      return null;
    }
  };

  const generateAndSendExcel = async () => {
    try {
      const excelBuffer = await generateExcelBuffer(options.selected_tests);
      if (excelBuffer) {
        await shareByEmail(excelBuffer);
      } else {
        console.error('Failed to generate Excel buffer');
      }
    } catch (error) {
      console.error('Error generating Excel:', error);
    }
  };

  const shareByEmail = async (excelBuffer) => {
    const base64Excel = btoa(String.fromCharCode(...new Uint8Array(excelBuffer)));
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        contentBuffer: base64Excel,
        fileName: 'report.xlsx'
      })
    });

    if (response.ok) {
      console.log('Email enviado con éxito');
      setPrePrinting(false);
    } else {
      console.error('Error al enviar email');
    }
  };

  //Initiates the printing process if valid options are selected.
  const printButtonHandler = (e) => {
    e.preventDefault();
    if (!options.include_summary && !options.include_charts && !options.include_raw_data) return;
    if (!options.selected_tests.length) return;

    setPrePrinting(false);
    setPrinting(true);
  }

  // Prepares and initiates Excel export with the selected options.
  const printExcelButtonHandler = (e) => {
    e.preventDefault();
    if (!options.include_summary && !options.include_charts && !options.include_raw_data) return;
    if (!options.selected_tests.length) return;

    setPrePrinting(false);
    let newOptions = { ...options };
    newOptions.excel_format = true;
    setOptions(newOptions);
    setPrinting(true);
  };

  //Adds selected non-printed tests to the print queue.
  const addButtonHanlder = (e) => {
    e.preventDefault();

    let selected_options = [];
    for (let op of nonSelectedTestsRef.current.children) {
      if (op.selected) selected_options.push(parseInt(op.value));
    }
    let new_options = { ...options };
    new_options.non_selected_tests = [];

    for (let op of options.non_selected_tests) {
      if (selected_options.includes(op.id)) new_options.selected_tests.push(op)
      else new_options.non_selected_tests.push(op)
    }

    new_options.selected_tests = new_options.selected_tests.sort((t1, t2) => (t1.id - t2.id));
    setOptions(new_options);
  }

  //Removes selected tests from the print queue.
  const removeButtonHandler = (e) => {
    e.preventDefault();

    let selected_options = [];
    for (let op of selectedTestsRef.current.children) {
      if (op.selected) selected_options.push(parseInt(op.value));
    }
    let new_options = { ...options };
    new_options.selected_tests = [];

    for (let op of options.selected_tests) {
      if (selected_options.includes(op.id)) new_options.non_selected_tests.push(op)
      else new_options.selected_tests.push(op)
    }

    new_options.non_selected_tests = new_options.non_selected_tests.sort((t1, t2) => (t1.id - t2.id));
    setOptions(new_options);
  }

  //Toggles the inclusion of a summary in the printout.
  const summaryCheckboxChangeHandler = (e) => {
    let newOptions = { ...options };
    newOptions.include_summary = e.target.checked;
    setOptions(newOptions);
  }
  //Toggles the inclusion of charts in the printout.
  const chartsCheckboxChangeHandler = (e) => {
    let newOptions = { ...options };
    newOptions.include_charts = e.target.checked;
    setOptions(newOptions);
  }

  //Toggles the inclusion of raw data in the printout.
  const rawdataCheckboxChangeHandler = (e) => {
    let newOptions = { ...options };
    newOptions.include_raw_data = e.target.checked;
    setOptions(newOptions);
  }

  //Handles selection change for including failed pieces.
  const hideFailsSelectChangeHanlder = (e) => {
    e.preventDefault();

    let newOptions = { ...options };
    newOptions.include_fails = e.target.value == "true";

    setOptions(newOptions);
  }

  return (
    <div className="z-10 top-0 left-0 fixed bg-opacity-30 h-screen w-screen bg-black flex items-center justify-center px-1 text-lg">
      <div className="bg-white p-4 rounded-lg">
        <div onClick={closeHandler} className="flex flex-row justify-center items-center relative mb-2">
          <h2 className="font-bold flex-grow text-center">Options</h2>
          <CloseIcon className="w-6 stroke-current text-black hover:text-red-500 hover:cursor-pointer absolute right-0" />
        </div>
        <div className="flex flex-col gap-y-5 items-center overflow-y-scroll md:overflow-y-visible" style={{ maxHeight: "75vh" }}>
          {
            !isUnique &&
            <div className='flex flex-col gap-y-1 items-center'>
              <p>Select the test IDs to include in de pdf</p>
              <div className="flex flex-col md:flex-row justify-between items-center gap-x-5">
                <div className='flex flex-col items-center'>
                  <h3 className='text-sm'>Non selected Tests</h3>
                  <select ref={nonSelectedTestsRef} size="6" id="nonSelectedTests" name="nonSelectedTests" className="py-1 px-3 border border-gray-400 w-36 " multiple>
                    {
                      options.non_selected_tests.map((t) => (<option key={`option-test-${t.id}`} value={t.id}>{t.id}</option>))
                    }
                  </select>
                </div>

                <div className="flex flex-row md:flex-col gap-y-3 gap-x-3">
                  <div onClick={addButtonHanlder}><RightArrowIcon className="w-7 fill-current text-black hover:cursor-pointer hover:text-green-300 rotate-90 md:rotate-0" /></div>
                  <div onClick={removeButtonHandler}><RightArrowIcon className="w-7 fill-current text-black hover:cursor-pointer hover:text-red-300 -rotate-90 md:rotate-180" /></div>
                </div>

                <div className='flex flex-col items-center'>
                  <h3 className='text-sm'>Selected Tests</h3>
                  <select ref={selectedTestsRef} size="6" id="selectedTests" name="selectedTests" className="py-1 px-3 border border-gray-400 w-36 " multiple>
                    {
                      options.selected_tests.map((t) => (<option key={`option-test-${t.id}`} value={t.id}>{t.id}</option>))
                    }
                  </select>
                </div>
              </div>
            </div>
          }

          <div className='flex flex-col items-center'>
            <p>Select the areas to include in the summary.</p>
            <div>
              <div className='flex flex-row gap-x-2 items-center'>
                <input defaultChecked={options.include_summary} onClick={summaryCheckboxChangeHandler} id="pareto-checkbox" name="pareto-checkbox" type="checkbox" />
                <label htmlFor="pareto-checkbox">Summary  / Pareto</label>
              </div>
              <div className='flex flex-row gap-x-2 items-center'>
                <input defaultChecked={options.include_charts} onClick={chartsCheckboxChangeHandler} id="histograms-checkbox" name="histograms-checkbox" type="checkbox" />
                <label htmlFor="histograms-checkbox">Histograms</label>
              </div>
              {options.include_charts && options.selected_tests.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm">Highlight test types in histograms:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2 text-sm">
                    {
                      Array.from(
                        new Set(
                          options.selected_tests.flatMap(t =>
                            t.test_result?.map(r => r.test_type) || []
                          )
                        )
                      )
                        .filter(testType =>
                          testsViewParameters[testType] && testsViewParameters[testType].units
                        )
                        .map(testType => {
                          const params = testsViewParameters[testType];
                          return (
                            <label key={testType} className="flex items-center gap-x-2">
                              <input
                                type="checkbox"
                                checked={options.highlighted_test_types?.includes(params.name) || false}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const newOptions = { ...options };
                                  const current = newOptions.highlighted_test_types || [];
                                  newOptions.highlighted_test_types = e.target.checked
                                    ? [...current, value]
                                    : current.filter(t => t !== value);
                                  setOptions(newOptions);
                                }}
                                value={params.name}
                              />
                              {params.name || testType}
                            </label>
                          )
                        })
                    }
                  </div>
                </div>
              )}

              <div className='flex flex-row gap-x-2 items-center'>
                <input checked={options.include_raw_data} onChange={rawdataCheckboxChangeHandler} id="rawdata-checkbox" name="rawdata-checkbox" type="checkbox" />
                <label htmlFor="rawdata-checkbox">Raw Data</label>
              </div>
            </div>
          </div>

          <div className='flex flex-row items-center gap-x-3'>
            <p>Include failed pieces?</p>
            <select onChange={hideFailsSelectChangeHanlder} className=''>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <span className='text-[17px] hover:underline text-indigo-900 hover:cursor-pointer transform hover:scale-105' onClick={printExcelButtonHandler}>Save Excel</span>
          <button onClick={printButtonHandler} className="border text-white bg-red-900 font-semibold rounded mx-auto px-5 py-1 transform hover:bg-red-800 hover:scale-105">Print</button>
          <div className='flex flex-col items-center mt-4'>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-400 rounded w-full"
              placeholder="example@example.com"
            />
            <button
              onClick={() => shareByEmail()}
              className="bg-red-500 text-white font-semibold rounded px-5 py-1 mt-2 hover:bg-red-600 w-full"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
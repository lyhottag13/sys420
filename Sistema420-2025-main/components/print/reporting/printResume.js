'use client';
import React, { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import PrintIcon from "../../svg/printIcon";
import PrintOptions from "./printOptions";
import ParetoChart from "../../pareto/paretoChart";
import MainHistogramContainer from "../../charts/mainHistogramsContainer";
import { testsViewParameters } from "../../../constants/index";
import Loader from "../../loader";
import autoTable from "jspdf-autotable";


/**
 * GeneratePdf Component
 * This component provides the functionality to generate PDF reports and Excel files
 * based on selected tests and specified options. It supports including summaries,
 * charts, and raw data within the generated documents. The component uses jsPDF for
 * PDF generation and ExcelJS  for Excel file creation.
 * 
 * Props:
 * @param {Array} testsArray - An array of test objects to be included in the generated report.
 * 
 * The component utilizes useRef to hold references to the dynamically rendered charts for
 * inclusion in the PDF. It uses useState to manage the state of pre-printing options and
 * the final printing action. The useEffect hook triggers the generation process once the
 * printing state is set to true.
 */
const GeneratePdf = ({ testsArray, totals }) => {
  // References for dynamic chart components for PDF generation
  const paretoChartRef = useRef(null);
  const histogramsContainerRef = useRef(null);
  // Creates a deep clone of the first testsArray object for security on extra properties.
  const clonedTest = structuredClone(testsArray[0]);
  /* 
    Creates a singleTest array with the totals object properties since we want
    to display the totals for all the tests without having to use the totals
    page. This way, the single test acts as a total. Sometimes, total doesn't
    exist, so we must add the totals ? check.
  */
  const singleTest = totals ? {
    ...clonedTest,
    application: totals.application,
    datecode: totals.datecode,
    elapsed_time: totals.elapsed_time,
    filename: totals.filename,
    final_yield: totals.final_yield,
    id: totals.id,
    idle_time: totals.idle_time,
    issue_quantity: totals.issue_quantity,
    issue_yield: totals.issue_yield,
    plt: totals.plt,
    pn: totals.pn,
    reject_quantity: totals.reject_quantity,
    relays_failed_420: totals.relays_failed_420,
    relays_failed_non_420: totals.relays_failed_non_420,
    relays_passed_420: totals.relays_passed_420,
    relays_tested: totals.relays_tested,
    revision: totals.revision,
    test_time: totals.test_time,
    total_quantity: totals.total_quantity,
    yield: totals.yield
  } : {
    ...clonedTest
  };

  /*
    For every consecutive test in the testsArray, this will modify their dut_no's to
    pick up the count after the last test, so that every single dut_no is unique in the
    table without losing any data. Otherwise, the overlapping dut_no's will overwrite
    each other.
  */
  for (let i = 1; i < testsArray.length; i++) {
    const final_dut_no = singleTest.test_result[singleTest.test_result.length - 1].dut_no;
    const modifiedTestResults = testsArray[i].test_result.map(test => ({ ...test, dut_no: test.dut_no + final_dut_no }));
    singleTest.test_result = [...singleTest.test_result, ...modifiedTestResults];
  }
  // Puts the singleTest in an array, since methods depend on the tests being in an array.
  const singleTestWrapper = [singleTest];
  // State management for printing and options
  const [prePrinting, setPrePrinting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [options, setOptions] = useState({
    selected_tests: singleTestWrapper,
    non_selected_tests: [],
    include_summary: true,
    include_charts: true,
    include_raw_data: true,
    include_fails: true,
    excel_format: false,
    // highlighted_tests_type:[] // guarda arreglos de test seleccionados para impresion de pdf
  });
  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      selected_tests: singleTestWrapper
    }));
    // If the URL has fromApp, then we will automatically start the printing process.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('fromApp')) {
      setPrinting(true);
    }
  }, [testsArray]);
  // Opens the printing options dialog
  const handlerBubbleClick = () => {
    setPrePrinting(true);
  };
  useEffect(() => {
    // Exit early if not in printing state or if required references are missing
    if (!printing || !paretoChartRef.current || !histogramsContainerRef.current) return;

    // Check if the Excel format option is selected and generate Excel file
    if (options.excel_format) {
      generateExcel();

      let newOptions = { ...options };
      newOptions.excel_format = false;
      setOptions(newOptions);

      return setPrinting(false);
    }

    // Proceed with PDF generation
    generatePdf();

    setPrinting(false);
  }, [printing, paretoChartRef, histogramsContainerRef]);

  async function generateExcel() {
    const workbook = new ExcelJS.Workbook();

    for (let i in options.selected_tests) {
      const test = options.selected_tests[i];
      const { headers, data } = getRawDataTable(test);
      // Affects the worksheet name. Dynamically adds 'Tests' instead of 'Test' if multiple tests exist.
      const worksheet = workbook.addWorksheet(`Test${test.filename.includes(',') ? 's' : ''} ${test.filename}`);

      const [newHeaders] = headers;

      worksheet.addRow(newHeaders);
      data.forEach(row => {
        worksheet.addRow(row);
      });
    }

    // Genera el archivo Excel en un buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Guarda el archivo en el navegador
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `${shortenFilenames(options.selected_tests[0])}.xlsx`);
  }

  //Generates a PDF report with selected tests and options.
  function generatePdf() {
    var doc = new jsPDF({
      unit: "pt",
      format: "letter",
    });
    doc.setFontSize(12);
    const singleTest = options.selected_tests[0];
    if (options.include_summary) {
      addTestSummary(doc, paretoChartRef.current.children[0].children[0], singleTest);

      if (options.include_charts || options.include_raw_data) doc.addPage();
    }
    if (options.include_charts) {

      addHistograms(doc, histogramsContainerRef.current.children[0].children[0], singleTest, options.highlighted_test_types);
      if (options.include_raw_data) doc.addPage();
    }
    if (options.include_raw_data) {
      addRawData(doc, singleTest);
    }

    // Creates a final page with all the filenames summarized neatly.
    doc.addPage();
    doc.setFontSize(12);
    addHeader(doc, singleTest);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(20);
    addCenteredTextOnRow(doc, 'FILENAMES:', 5);
    doc.setFont(undefined, 'normal');
    const filenames = singleTest.filename.split(', ');
    for (let i = 0; i < filenames.length; i++) {
      addCenteredTextOnRow(doc, filenames[i], 6 + i);
    }
    doc.save(shortenFilenames(singleTest));
    /* 
      Sends the user back to the filter page after printing since the app gets stuck 
      loading otherwise. However, this only happens when the test to be printed 
      has the checkboxes inside the printOptions window.
    */
    window.location = '/reporting/filter';
  }

  /**
   * Utility function to add text centered on a given row in the PDF document.
   * 
   * @param {jsPDF} doc - The jsPDF document instance.
   * @param {string} text - The text to be added.
   * @param {number} row - The row number to place the text at.
  */
  function addCenteredTextOnRow(doc, text, row) {
    const interline = 2;
    const top = 42.5;
    let rowSize = doc.getFontSize() + interline;
    let positionY = row * rowSize + top;

    doc.text(text, (586.7 - doc.getTextWidth(text)) / 2, positionY);
  }

  /**
   * Adds a text block to the PDF document at a specified location.
   * @param {jsPDF} doc - The jsPDF document instance.
   * @param {string} text - The text to be added.
   * @param {number} y - The y-axis position for the text.
   * @param {number} x1 - The starting x-axis position for the centered text.
   * @param {number} x2 - The ending x-axis position for the centered text.
   */
  function addCenteredText(doc, text, y, x1, x2) {
    const positionX = (x2 - x1 - doc.getTextWidth(text)) / 2 + x1;

    doc.text(text, positionX, y);
  }

  /**
   * Adds text to a specified row and x-coordinate in the PDF document.
   * 
   * @param {jsPDF} doc - The jsPDF document instance.
   * @param {string} text - The text content.
   * @param {number} row - The row number (vertical position).
   * @param {number} x - The x-coordinate (horizontal position) for the text.
  */
  function addTextOnRow(doc, text, row, x) {
    const interline = 2;
    const top = 42.5;

    let rowSize = doc.getFontSize() + interline;
    let positionY = row * rowSize + top;

    doc.text(text, x, positionY);
  }
  function addTextOnRowLtR(doc, text, row, x) {
    text = text ? text : "";
    const interline = 2;
    const top = 42.5;
    const textWidth = doc.getTextWidth(text);

    let rowSize = doc.getFontSize() + interline;
    let positionY = row * rowSize + top;

    doc.text(text, x - textWidth, positionY);
  }

  /**
   * Adds a header section to each page of the PDF, containing test metadata.
   * @param {jsPDF} doc - The jsPDF document instance.
   * @param {Object} test - The test object containing metadata to be displayed in the header.
   */
  function addHeader(doc, test) {
    doc.line(22.6, 30, 586.7, 30);
    doc.setFont(undefined, "bold");
    addTextOnRow(
      doc,
      `COTO System 420 - \nPN      : \nAPPL : \nREV# :`,
      0,
      22.6
    );
    addTextOnRow(doc, `PLT  : \nLOT : \nDC   :`, 1, 210.6);
    addTextOnRow(doc, `FILENAME  :\nTEST DATE   :\nSTART TIME :`, 1, 398.6);
    doc.setFont(undefined, "normal");

    const dateParts = test.start_datetime.slice(0, 10).split('-'); // Assumes the format is 'YYYY-MM-DD'
    const formattedDate = `${dateParts[1]}-${dateParts[2]}-${dateParts[0]}`;

    const filenameInHeader = shortenFilenames(test);
    addTextOnRow(doc, `Vers 1.0`, 0, 140);                          //System 420 Version
    addTextOnRow(doc, `${test.type_of_test}`, 0, 230);             //type_of_test
    addTextOnRow(doc, `${test.pn}\n${test.application}\n${test.revision}`, 1, 73);
    addTextOnRow(doc, `${test.plt}\n${test.lot_number}\n${test.datecode}`, 1, 250);
    addTextOnRow(doc, `${filenameInHeader}\n${formattedDate}\n${test.start_datetime.slice(11, 19)}`, 1, 485);
    doc.line(22.6, 90, 586.7, 90);
  }

  function shortenFilenames(test) {
    const filenames = test.filename.split(', ');
    let filenameInHeader = filenames[0];
    // Adds the little blurb afterwards if there are additional filenames.
    if (filenames.length > 1) {
      filenameInHeader += ` & ${filenames.length - 1} More`;
    }
    return filenameInHeader;
  }

  /**
   * Adds a test summary section to the PDF document for a given test.
   * Includes a header with test metadata and a summary of test results.
   * If Pareto charts or raw data are included, additional pages are added as needed.
   * 
   * @param {jsPDF} doc - The jsPDF document instance.
   * @param {HTMLCanvasElement} paretoChart - The canvas element containing the Pareto chart for the test.
   * @param {Object} test - The test object containing data for the summary.
  */
  function addTestSummary(doc, paretoChart, test) {
    addHeader(doc, test);

    // Subtitles 1
    doc.setFont(undefined, "bold");
    addCenteredTextOnRow(doc, "TEST SUMMARY", 6);
    addTextOnRow(doc, "SYSTEM 420 . . ", 8, 160);
    addTextOnRow(doc, "NON-420 . . . .  ", 13, 160);
    addTextOnRow(doc, "FINAL YIELD . ", 15, 160);
    addTextOnRow(doc, "ISSUE YIELD . ", 19, 160);
    addTextOnRow(doc, "TIME . . . . . . . . ", 22, 160);
    addTextOnRow(doc, "RATE . . . . . . .  ", 26, 160);

    // Subtitles 2
    doc.setFont(undefined, "normal");
    addTextOnRow(doc, "Relays tested", 8, 250);
    addTextOnRow(doc, "Relays passed", 9, 250);
    addTextOnRow(doc, "Relays failed", 10, 250);
    addTextOnRow(doc, "Yield (system 420)", 11, 250);

    addTextOnRow(doc, "Non-420 rejects", 13, 250);

    addTextOnRow(doc, "Total quantity", 15, 250);
    addTextOnRow(doc, "Reject quantity", 16, 250);
    addTextOnRow(doc, "Final yield", 17, 250);

    addTextOnRow(doc, "Issue quantity", 19, 250);
    addTextOnRow(doc, "Issue yield", 20, 250);

    addTextOnRow(doc, "Elapsed time", 22, 250);
    addTextOnRow(doc, "Idle time", 23, 250);
    addTextOnRow(doc, "Test time", 24, 250);

    addTextOnRow(doc, "Actual rate (RPH)", 26, 250);
    addTextOnRow(doc, "Avg. test rate (RPH)", 27, 250);
    addTextOnRow(doc, "Peak test rate (RPH)", 28, 250);

    for (let i = 8; i <= 28; i++) {
      if ([12, 14, 18, 21, 25].includes(i)) continue;
      addTextOnRow(doc, ":", i, 365);
    }

    // Info
    addTextOnRowLtR(doc, `${test?.relays_tested}`, 8, 445); // Relays tested
    addTextOnRowLtR(doc, `${test?.relays_passed_420}`, 9, 445); // Relays passed
    addTextOnRowLtR(doc, `${test?.relays_failed_420}`, 10, 445); // Relays failed

    addTextOnRowLtR(doc, `${test?.relays_failed_non_420}`, 13, 445); // Non-420 rejects

    addTextOnRowLtR(doc, `${test?.total_quantity}`, 15, 445); // Total quantity
    addTextOnRowLtR(doc, `${test?.reject_quantity}`, 16, 445); // Reject quantity

    addTextOnRowLtR(doc, `${test?.issue_quantity}`, 19, 445); // Issue quantity

    addTextOnRowLtR(doc, test?.elapsed_time?.slice(11, 19), 22, 445); // Elapsed time
    addTextOnRowLtR(doc, test?.idle_time?.slice(11, 19), 23, 445); // Idle time
    addTextOnRowLtR(doc, test?.test_time?.slice(11, 19), 24, 445); // Test time

    addTextOnRowLtR(doc, "UNKNOWN", 26, 445); // Actual rate (RPH)'
    addTextOnRowLtR(doc, "UNKNOWN", 27, 445); // Avg. test rate (RPH)
    addTextOnRowLtR(doc, "UNKNOWN", 28, 445); // Peak test rate (RPH)

    doc.setFont(undefined, "bold");
    addTextOnRowLtR(doc, `${test?.yield}`, 11, 435); // Yield (system 420)
    addTextOnRowLtR(doc, `${test?.final_yield}`, 17, 435); // Final yield
    addTextOnRowLtR(doc, `${test?.issue_yield}`, 20, 435); // Issue yield

    // Symbols
    addTextOnRow(doc, "%", 11, 437);
    addTextOnRow(doc, "%", 17, 437);
    addTextOnRow(doc, "%", 20, 437);

    // Pareto
    doc.setFont(undefined, "bold");
    addCenteredTextOnRow(doc, "PARETO FAILURE ANALYSIS", 31);

    addWhiteBgtoCanva(paretoChart);
    doc.addImage(
      paretoChart.toDataURL("image/jpeg", 1.0),
      "JPEG",
      150,
      480,
      320,
      245
    );
  }

  /**
   * Adds a section to the PDF document containing raw data of the selected test.
   * Data is formatted as a table using jsPDF's autoTable plugin.
   * 
   * @param {jsPDF} doc - The jsPDF document instance.
   * @param {Object} test - The test object containing the raw data to be added to the PDF.
  */
  function addRawData(doc, test) {
    addHeader(doc, test);

    const { headers, data } = getRawDataTable(test);

    autoTable(doc, {
      startY: 108,
      styles: {
        halign: "center",
        fillColor: 255,
        textColor: "black",
        lineColor: 70,
        lineWidth: 1,
        fontSize: 6,
      },
      head: headers,
      body: data,
    });
  }

  /**
   * Adds histogram charts to the PDF document for a given test.
   * Each histogram is inserted into the document along with test-specific metadata.
   * 
   * @param {jsPDF} doc - The jsPDF document instance.
   * @param {HTMLElement} container - The container element holding histogram canvases for the test.
   * @param {Object} test - The test object associated with the histograms.
   * @param {Object} test_seleccionados - AGREGADO Test seleccionados por el usuario para impresin de histogramas
  */
  function addHistograms(doc, container, test, test_seleccionados) {
    if (!Array.isArray(test_seleccionados)) test_seleccionados = [];
    addHeader(doc, test);
    const fontSize = 10;
    const initialY = 120; //margen de header cuando se inicializa la hoja
    const xCoord = [50, 320];
    const isLargeChart = test_seleccionados.length !== 0;
    const chartWidth = isLargeChart ? 400 : 200;// si se hace seleccion de test, cambia tamano de chart 
    const chartHeight = isLargeChart ? 180 : 90;
    const gapChartY = 30;
    const gapTitleY = -7;
    const Xbox = isLargeChart ? 380 : 180;
    const Ybox = 10;
    const boxWidth = 60;
    const boxHeight = 40;
    const boxIndentationX = 3;
    const boxIndentationY = 10;

    const distanceTitleY = fontSize + gapTitleY;
    const distanceChartY = chartHeight + gapChartY;

    const maxChartHeight = 762 - (distanceChartY + distanceTitleY);

    doc.setFontSize(fontSize);

    let y = initialY;
    let xIteration = 0; // cuando se imprimen todos los canvas en tamaño pequeño, cuenta cuantos graficos por renglon 

    function insertHistogramCanvas(htmlReference) {
      if (htmlReference.localName === "canvas") {
        const test_type = htmlReference.attributes.test_type ? htmlReference.attributes.test_type.nodeValue : "";
        if (test_seleccionados.length === 0 || test_seleccionados.includes(test_type)) {
          // Si es gráfico grande, siempre usar xCoord[0], si pequeño usar alternancia
          const x = isLargeChart ? xCoord[0] : xCoord[xIteration];

          let mean = htmlReference.attributes.mean.nodeValue;
          let sigma = htmlReference.attributes.sigma.nodeValue;
          let ucpk = htmlReference.attributes.ucpk.nodeValue;
          let lcpk = htmlReference.attributes.lcpk.nodeValue;

          addCenteredText(doc, test_type, y, x, x + chartWidth);

          addWhiteBgtoCanva(htmlReference);
          doc.addImage(
            htmlReference.toDataURL("image/jpeg", 1.0),
            "JPEG",
            x,
            y + distanceTitleY,
            chartWidth,
            chartHeight
          );

          // Box estadístico
          doc.setFontSize(7);
          doc.setFillColor("#FFFFFF").rect(x + Xbox, y + Ybox, boxWidth, boxHeight, 'FD');
          doc.text([
            `Mean: ${mean}`,
            `Sigma: ${sigma}`,
            `UCpk: ${ucpk}`,
            `LCpk: ${lcpk}`
          ], x + Xbox + boxIndentationX, y + Ybox + boxIndentationY);

          doc.setFontSize(fontSize);

          if (isLargeChart) {
            // para gráficos grandes, avanzar Y siempre porque solo uno por línea
            y += distanceChartY;
          } else {
            // para gráficos pequeños, alternar posición horizontal
            xIteration = (xIteration + 1) % 2;
            if (xIteration === 0) {
              y += distanceChartY;
            }
          }
        }
      }
      // recursivo para encontrar todos los elementos canvas y agregar histograma 
      for (let child of htmlReference.children) {
        insertHistogramCanvas(child);
      }
    }

    for (let switchContainer of container.children) {
      const switch_name = switchContainer.attributes.switch_name.nodeValue;

      doc.setFont(undefined, "bold");
      addCenteredText(doc, switch_name, y, 22.6, 586.7);

      doc.setFont(undefined, "normal");
      y += fontSize;
      insertHistogramCanvas(switchContainer);

      if (y > maxChartHeight) {
        // Adds a new page and resets the chart y and x positions so there is no chart overlap.
        y = initialY;
        xIteration = 0;
        doc.addPage();
        addHeader(doc, test);
      } else {
        if (!isLargeChart) {
          y += distanceChartY;
        }
        xIteration = 0;
      }
    }
  }


  /**
   * Applies a white background to a canvas element. This is necessary because the canvas might have
   * a transparent background by default, which could result in unexpected visuals when inserted into
   * the PDF document.
   * 
   * @param {HTMLCanvasElement} canvas - The canvas element to modify.
  */
  function addWhiteBgtoCanva(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "WHITE";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  /**
   * Transforms test results into a format suitable for the Pareto analysis table in the PDF document.
   * It aggregates failure counts by test type for inclusion in the Pareto section.
   * 
   * @param {Object} test - The test object containing test results for Pareto analysis.
   * @return {Array} A 2D array suitable for the body of a jsPDF autoTable.
  */
  function getParetoTable(test) {
    const selected_test_results = test.test_result;
    const pareto_object = {};
    const pareto_array = [];

    for (let result of selected_test_results) {
      if (result.result == 'PASS') continue;

      if (!pareto_object[result.test_type]) pareto_object[result.test_type] = { name: testsViewParameters[result.test_type].name, quantity: 0 };

      pareto_object[result.test_type].quantity++;
    }

    for (let key in pareto_object) {
      const { name, quantity } = pareto_object[key];
      pareto_array.push([name, `${quantity}`]);
    }

    return pareto_array;
  }
  /**
   * Prepares the raw data table from the test results for inclusion in the PDF or Excel file.
   * Formats the raw test data into a structure suitable for jsPDF's autoTable plugin or XLSX export.
   * 
   * @param {Object} test - The test object containing raw data results.
   * @return {Object} An object containing formatted headers and data ready for export.
  */
  function getRawDataTable(test) {
    const selected_test_results = test.test_result;
    let temporal_data = []; // Temporary data stored with each iteration.
    let data = []; // The real data that gets pushed to the excel table.
    let headers = ["DUT", "SW"];

    let active_test_object = {};
    let test_counter = 2; // The number of tests performed on a switch/relay combo. Default is 2 since our two headers push up the queue.
    let max_switch = 0; // Tracks the maximum number of switches being tested.
    for (let result of selected_test_results) {
      let actual_switch = result.switch;
      // Increments the max_switch is result.switch is greater.
      if (result.switch > max_switch) {
        max_switch = result.switch;
      }
      // If active_test_object does not contain a header test_type, then it is added to its list.
      if (!active_test_object[result.test_type]) {
        headers.push(testsViewParameters[result.test_type].short_name);
        active_test_object[result.test_type] = test_counter;
        test_counter++;
      }
      if (!temporal_data[result.dut_no]) temporal_data[result.dut_no] = [];
      if (!temporal_data[result.dut_no][actual_switch]) temporal_data[result.dut_no][actual_switch] = [`${result.dut_no}`, `${actual_switch}`];

      // Usar el valor convertido
      temporal_data[result.dut_no][actual_switch][active_test_object[result.test_type]] = result.value ? `${parseFloat(result.value).toFixed(testsViewParameters[result.test_type].decimals)}` : result.result;
    }

    for (let dut_data of temporal_data) {
      if (!dut_data) continue;
      for (let switch_data of dut_data) {
        if (!switch_data) continue;
        data.push(switch_data.map(value => isNaN(value) ? value : parseFloat(value)));
      }
    }
    /*
    Only triggers if this group of tests had any switch tests. However, there
    is a chance a user might combine tests with different switch amounts, so
    I've included additional checks to prevent the generation from crashing.
    */
    if (max_switch > 0) {
      combineSwitchZeroTests(data);
    }
    return { headers: [headers], data };
  }

  /**
   * Eliminates all rows where switch = 0 and combines them with the switch = 1
   * rows. There are various validations within the function to prevent unnecessary
   * trimming. This function expects all the tests to have the same number of
   * switches, though it's possible a user may combine a 0 switch with a 4 switch,
   * so there are validations to account for that, too.
   */
  function combineSwitchZeroTests(data) {
    for (let row = 0; row < data.length; row++) {
      const currentRow = data[row];
      const nextRow = data[row + 1];
      const switchNumber = currentRow[1];
      if (switchNumber === 0) {
        // We skip the first two columns since they include non-test data (dut_no and switch).
        for (let column = 2; column < currentRow.length; column++) {
          // Adds all the switch = 0 data to the switch = 1 row if it's valid and nextRow exists.
          if (currentRow[column] && toString(currentRow[column]).length > 0 && nextRow) {
            nextRow[column] = currentRow[column];
          }
        }
        // Deletes the switch = 0 row if nextRow exists and nextRow's switch isn't 0.
        if (nextRow && nextRow[1] !== 0) {
          data.splice(row, 1);
        }
      }
    }
    return data;
  }

  return (
    <div className="w-full bg-white">
      <button
        onClick={handlerBubbleClick}
        className="transform hover:scale-125 hover:border rounded-full bg-blue-500 p-2 fixed bottom-4 right-4"
      >
        <PrintIcon className="fill-current text-white m-0 text-xl" />
      </button>
      {
        printing &&
        <Loader />
      }
      {
        prePrinting &&
        <PrintOptions isUnique={testsArray.length == 1} setPrePrinting={setPrePrinting} setPrinting={setPrinting} options={options} setOptions={setOptions} printing={printing} />
      }
      {
        printing &&
        <div ref={paretoChartRef}>
          {
            options.selected_tests.map((test) => (
              <div key={`pareto-container-test${test.id}`} style={{ maxWidth: "none", maxHeight: "none", height: "600px", width: "600px" }}>
                <ParetoChart selectedTest={test} printing={true} />
              </div>
            ))
          }
        </div>
      }
      {
        printing &&
        <div ref={histogramsContainerRef}>

          {

            options.selected_tests.map((test) => (
              <div key={`histogram-main-container-test${test.id}`} style={{ maxWidth: "none", maxHeight: "none", height: "270px", width: "600px" }}>
                {<MainHistogramContainer hideFails={!options.include_fails} selectedTest={!options.highlighted_tests_types ? test : options.highlighted_tests_types} printing={true} />}
              </div>
            ))
          }
        </div>
      }
    </div>
  );
};

export default GeneratePdf;

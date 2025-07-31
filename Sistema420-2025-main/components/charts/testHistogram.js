import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { testsViewParameters } from "../../constants/index";
import RightArrowIcon from "../svg/rightArrowIcon";
import { useState, useEffect, useRef } from "react";
import pattern from "patternomaly";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
);



/**
 * Rounds a number to a specified number of decimal places.
 * @param {number} number - The number to round.
 * @param {number} decimals - The number of decimal places to round to.
 * @returns {number} number The rounded number.
 */
function roundDecimals(number, decimals) {
  const power = Math.pow(10, decimals);
  return Math.round(number * power) / power;
}

/**
 * Retrieves the dataset for generating a chart based on the provided test data, test type, and parameters.
 * Ahora incluye el zoomRange para el desglose dinámico de overflow/underflow.
 * @param {number[]} testArray - An array containing the test data.
 * @param {string} testType - The type of test.
 * @param {Object} params - Additional parameters for the test.
 * @param {Object} zoomRange - El rango visible actual del gráfico {min, max}.
 * @returns {Object} An object containing the dataset for the chart.
 */
function getChartDataSet(testArray, testType, params, zoomRange) {
  const name = testsViewParameters[testType].name;
  const min_view = parseFloat(testsViewParameters[testType].min_view(params));
  const max_view = parseFloat(testsViewParameters[testType].max_view(params));
  const min_overflow_threshold = testsViewParameters[testType].min_overflow ? parseFloat(testsViewParameters[testType].min_overflow(params)) : min_view * 0.9;
  const max_overflow_threshold = testsViewParameters[testType].max_overflow ? parseFloat(testsViewParameters[testType].max_overflow(params)) : max_view * 1.1;

  const min_pass = testsViewParameters[testType].min_pass && parseFloat(testsViewParameters[testType].min_pass(params));
  const max_pass = testsViewParameters[testType].max_pass && parseFloat(testsViewParameters[testType].max_pass(params));

  const bin_size = parseFloat(testsViewParameters[testType].bin_size);

  // Calculate the mean
  let nonNulltestArray = testArray.filter((v) => v || v === 0)
  const sum = nonNulltestArray.reduce((a, b) => a + b);
  const mean = sum / nonNulltestArray.length;

  // Calculate the standard deviation (σ)
  const variance = nonNulltestArray.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (nonNulltestArray.length - 1);
  const sigma = Math.sqrt(variance);

  /**
   * Calculate CPK
   * @param {*} USL - Upper specification limit
   * @param {*} LSL - Lower specification limit
   * @param {number} cpk - Measures the capability of a process*/

  const USL = max_pass ? max_pass : Infinity;
  const LSL = min_pass ? parseFloat(min_pass) : null;
  const cpk = Math.min((USL - mean) / (3 * sigma), (mean - LSL) / (3 * sigma))

  /**
   * Calculate the upper and lower control limits (UCPK and LCPK)
   * @param {float} ucpk - Upper Control Process Capability
   * @param {float} lcpk - Lower Control Process Capability  */
  const ucpk = (USL - mean) / (3 * sigma);
  const lcpk = (mean - LSL) / (3 * sigma);;

  let max_frequency = 0;

  // Arrays creation
  let passObject = {};
  let failObject = {};
  let overflowObject = {};
  let underflowObject = {};

  // OJO: Usamos zoomRange (la vista actual del gráfico) para determinar el overflow dinámico
  const currentVisibleMin = zoomRange.min;
  const currentVisibleMax = zoomRange.max;

  for (let value of testArray) {
    value = parseFloat(value);
    let rounded_bin = Math.floor(value / bin_size) * bin_size;
    let next_bin = rounded_bin + bin_size;

    // Lógica para el desglose dinámico del overflow/underflow
    if (value > currentVisibleMax) {
      // Si el valor está fuera del límite visible superior
      const overflowX = currentVisibleMax + (bin_size / 2); // Posición dinámica justo al borde de la vista
      if (overflowObject[overflowX]) overflowObject[overflowX].value++;
      else overflowObject[overflowX] = { value: 1, label: `>${roundDecimals(currentVisibleMax, 2)}` }; // Etiqueta dinámica
    } else if (value < currentVisibleMin) {
      // Si el valor está fuera del límite visible inferior
      const underflowX = currentVisibleMin - (bin_size / 2); // Posición dinámica justo al borde de la vista
      if (underflowObject[underflowX]) underflowObject[underflowX].value++;
      else underflowObject[underflowX] = { value: 1, label: `<${roundDecimals(currentVisibleMin, 2)}` }; // Etiqueta dinámica
    } else {
      // Lógica existente para PASS/FAIL si el valor está dentro del rango visible
      if (rounded_bin <= min_pass && value >= min_pass) {
        rounded_bin = min_pass;
        next_bin = Math.floor((min_pass + bin_size) / bin_size) * bin_size;
      }
      else if (next_bin >= max_pass && value <= max_pass) {
        next_bin = max_pass;
        rounded_bin = Math.floor((max_pass - bin_size) / bin_size) * bin_size;
      }
      else if (rounded_bin <= max_pass && value > max_pass) {
        rounded_bin = max_pass;
        next_bin = Math.floor((max_pass + bin_size) / bin_size) * bin_size;
      }
      else if (next_bin >= min_pass && value < min_pass) {
        next_bin = min_pass;
        rounded_bin = Math.floor((min_pass - bin_size) / bin_size) * bin_size;
      }
      if (rounded_bin < 0) rounded_bin = 0;


      rounded_bin = roundDecimals(rounded_bin, 4);
      next_bin = roundDecimals(next_bin, 4);

      let average_bin = (rounded_bin + next_bin) / 2;
      let actual_label = `${rounded_bin} - ${next_bin}`;

      if (rounded_bin < min_pass || next_bin > max_pass) {
        if (failObject[average_bin]) failObject[average_bin].value++;
        else failObject[average_bin] = { value: 1, label: actual_label };
      }
      else {
        if (passObject[average_bin]) passObject[average_bin].value++;
        else passObject[average_bin] = { value: 1, label: actual_label };
      }
    }
  }

  // Objects to arrays
  let pass_array = [];
  let fail_array = [];
  let overflow_array = [];
  let underflow_array = [];

  for (let i in overflowObject) {
    overflow_array.push({ x: parseFloat(i), y: overflowObject[i].value, label: overflowObject[i].label });
  }
  for (let i in underflowObject) {
    underflow_array.push({ x: parseFloat(i), y: underflowObject[i].value, label: underflowObject[i].label });
  }
  for (let i in passObject) {
    pass_array.push({ x: parseFloat(i), y: passObject[i].value, label: passObject[i].label });

    if (passObject[i].value > max_frequency) max_frequency = passObject[i].value;
  }
  for (let i in failObject) {
    fail_array.push({ x: parseFloat(i), y: failObject[i].value, label: failObject[i].label });

    if (failObject[i].value > max_frequency) max_frequency = failObject[i].value;
  }

  return { overflow_array, underflow_array, name, pass_array, fail_array, step_size: bin_size, units: 'ohms', max_frequency: Math.ceil(max_frequency / 5) * 5, max_view, min_view, min_pass, max_pass, mean: roundDecimals(mean, 2), sigma: roundDecimals(sigma, 2), ucpk: roundDecimals(ucpk, 2), lcpk: roundDecimals(lcpk, 2) };
}


/**
 * function TestHistogram-- Generates a histogram chart for visualizing test data.
 * @param {Object} params - Additional parameters for the test.
 * @param {boolean} printing - Indicates whether the chart is intended for printing.
 * @param {boolean} hideFails - Indicates whether to hide failed data points on the chart.
 * @param {number[]} testArray - An array containing the numerical test data.
 * @param {string} testType - The type of test.
 * @returns {JSX.Element} A React component for displaying the histogram chart.
 */
export default function TestHistogram({ params, printing, hideFails, testArray, testType }) {
  const initialMin = parseFloat(testsViewParameters[testType].min_view(params));
  const initialMax = parseFloat(testsViewParameters[testType].max_view(params));

  // Dynamically imports a CLIENT-ONLY import because otherwise the whole app can't build.
  useEffect(() => {
    (async () => {
      const zoomPlugin = await import('chartjs-plugin-zoom');
      ChartJS.register(zoomPlugin.default);
    })();
  }, []);

  // Estado para el rango de zoom. Inicialmente, el rango de vista completo.
  const [zoomRange, setZoomRange] = useState({ min: initialMin, max: initialMax });

  // Reiniciar zoomRange cuando los parámetros del test cambian
  useEffect(() => {
    setZoomRange({ min: initialMin, max: initialMax });
  }, [testType, params, initialMin, initialMax]); // Dependencias del efecto

  // Pasa el zoomRange al getChartDataSet para el desglose dinámico de overflow/underflow
  const { name, pass_array, fail_array, overflow_array, underflow_array, step_size, units, max_frequency, max_view, min_view, min_pass, max_pass, mean, sigma, ucpk, lcpk } = getChartDataSet(testArray, testType, params, zoomRange);
  const chartRef = useRef(null);

  const data = {
    datasets: [
      ...(
        underflow_array.length > 0 ?
          [{
            stack: 1,
            label: "UNDERFLOW",
            data: underflow_array,
            backgroundColor: 'rgba(100, 100, 255, 0.6)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 0.5,
            categoryPercentage: 1,
            barPercentage: 1,
          }] : []
      ),
      ...(
        hideFails ?
          []
          :
          [
            {
              stack: 1,
              label: "FAIL",
              data: fail_array,
              backgroundColor: printing ? pattern.draw('square', 'rgba(255, 99, 132, 1)') : 'rgba(255, 99, 132, 1)',
              borderColor: 'rgba(0, 0, 0)',
              borderWidth: 0.5,
              categoryPercentage: 1,
              barPercentage: 1,
            }
          ]
      ),
      {
        stack: 1,
        label: "PASS",
        data: pass_array,
        backgroundColor: 'rgba(54, 162, 235, 1)',
        borderColor: 'rgba(0, 0, 0)',
        borderWidth: 0.5,
        categoryPercentage: 1,
        barPercentage: 1,
      },
      ...(
        overflow_array.length > 0 ?
          [{
            stack: 1,
            label: "OVERFLOW",
            data: overflow_array,
            backgroundColor: 'rgba(255, 165, 0, 0.6)',
            borderColor: 'rgba(0, 0, 0)',
            borderWidth: 0.5,
            categoryPercentage: 1,
            barPercentage: 1,
          }] : []
      ),
    ],
  };

  const options = {
    animation: {
      duration: 0
    },
    scales: {
      x: {
        type: 'linear',
        offset: true,
        grid: {
          offset: false
        },
        ticks: {
          step_size,
          font: {
            size: printing ? 17 : 12,
          },
        },
        title: {
          display: true,
          text: units,
          font: {
            size: printing ? 22 : 12,
          },
        },
        // Los límites del eje X están controlados por el estado zoomRange
        min: zoomRange.min,
        max: zoomRange.max,
      },
      y: {
        beginAtZero: true,
        max: max_frequency,
        title: {
          display: true,
          text: 'Frequency',
          font: {
            size: printing ? 22 : 12,
          },
        },
        ticks: {
          font: {
            size: printing ? 17 : 12,
          },
        },
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (items) => (items[0].raw.label)
        }
      },
      legend: {
        display: !hideFails
      },
      annotation: {
        annotations: {
          line1: min_pass && {
            type: 'line',
            xMax: min_pass,
            xMin: min_pass,
            borderWidth: 1,
            borderDash: [3, 3],
            borderColor: 'rgb(0, 0, 0)',
            label: {
              content: 'MIN',
              enabled: true,
              color: 'rgb(255,255,255)',
              backgroundColor: 'rgb(125, 125, 125)',
              position: 'start'
            }
          },
          line2: max_pass && {
            type: 'line',
            xMax: max_pass,
            xMin: max_pass,
            borderWidth: 1,
            borderDash: [3, 3],
            borderColor: 'rgb(0, 0, 0)',
            label: {
              content: 'MAX',
              enabled: true,
              color: 'rgb(255,255,255)',
              backgroundColor: 'rgb(125, 125, 125)',
              position: 'start'
            }
          },
        }
      },
      zoom: {
        pan: {
          enabled: true, // El pan sigue habilitado
          mode: 'x',    // Solo en el eje X
          modifierKey: null, // Sin tecla modificadora para el arrastre normal
          onPanComplete: ({ chart }) => {
            const xScale = chart.scales.x;
            setZoomRange({ min: xScale.min, max: xScale.max });
          },
        },
        zoom: {
          wheel: {
            enabled: true, // Habilita el zoom con la rueda del ratón
          },
          pinch: {
            enabled: true, // Habilita el zoom con el gesto de pinza
          },
          drag: {
            enabled: false, // Asegúrate de que el zoom por arrastre (drag) esté deshabilitado si quieres que el arrastre sea solo para pan
          },
          mode: 'x', // El zoom también será solo en el eje X
          onZoomComplete: ({ chart }) => { // Callback al finalizar el zoom
            const xScale = chart.scales.x;
            setZoomRange({ min: xScale.min, max: xScale.max });
          },
        }
      }
    }
  };

  const resetView = (e) => {
    e.preventDefault();

    if (chartRef.current) {
      chartRef.current.resetZoom();
      // También resetea el estado de zoomRange a los valores iniciales
      // para que el UI refleje el reset y getChartDataSet se re-calcule.
      setZoomRange({ min: initialMin, max: initialMax });
    }
  }

  return (
    <div className={printing ? 'w-full text-center' : 'w-full text-center max-w-lg flex flex-col'}>
      <h1 className="text-md">{name}</h1>
      {/* Pasa la referencia al componente Bar */}
      <Bar ref={chartRef} test_type={name} data={data} options={options} mean={mean} sigma={sigma} ucpk={ucpk} lcpk={lcpk} />
      <div className="flex flex-col gap-y-2 items-center ml-12 mr-2">
        <div className="flex flex-row w-full px-5 justify-center">
          <button onClick={resetView} className="bg-blue-300 rounded-lg px-2 hover:bg-blue-800 transform hover:scale-105 text-white" >
            Reset View
          </button>
        </div>
        <div className="flex flex-row max-w-sm flex-wrap justify-center gap-x-5 text-sm bg-red-100 px-2 py-1 rounded">
          <div className="flex flex-row gap-x-1">
            <p className="font-bold">Mean:</p>
            <p className="whitespace-nowrap">{mean}</p>
          </div>
          <div className="flex flex-row gap-x-1">
            <p className="font-bold">Sigma:</p>
            <p className="whitespace-nowrap">{sigma}</p>
          </div>
          <div className="flex flex-row gap-x-1">
            <p className="font-bold">UCpk:</p>
            <p className="whitespace-nowrap">{ucpk}</p>
          </div>
          <div className="flex flex-row gap-x-1">
            <p className="font-bold">LCpk:</p>
            <p className="whitespace-nowrap">{lcpk}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
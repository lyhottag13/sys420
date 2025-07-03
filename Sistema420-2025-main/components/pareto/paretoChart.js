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
import { useMemo } from "react";
import { testsViewParameters } from "../../constants/index";
import pattern from "patternomaly";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ParetoChart({ selectedTest, printing }) {
  // Definir el orden de las fallas personalizadas
  const customOrder = [
    'KEL', 'SHO', 'DIO', 'CRS', 'IRS', 'SCR', 'OVT', 'RVT', 'RCU', 'OCU', 
    'OVD', 'OVR', 'ATM', 'OTM', 'RTM', 'DCR', 'DCP', 'SCS', 'FBO'
  ];

  // Usar useMemo para preparar los datos
  const { data, labels } = useMemo(() => {
    let objectData = {};
    let processed = {};  // Objeto para controlar los DUT ya procesados

    // Crear una copia de los resultados de la prueba para no modificar los originales
    const sortedTestResults = [...selectedTest.test_result];

    // Ordenar las pruebas por test_type según el customOrder
    sortedTestResults.sort((a, b) => {
      const indexA = customOrder.indexOf(a.test_type);
      const indexB = customOrder.indexOf(b.test_type);
      if (indexA === -1) return 1;  // Si no se encuentra en customOrder, lo coloca al final
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // Procesar los resultados de las pruebas
    for (let { dut_no, test_type, result } of sortedTestResults) {
      // Solo contar la primera falla por DUT (independientemente del test_type)
      if (result !== "PASS" && !processed[dut_no]) {
        // Si no se ha procesado el DUT, agregar al conteo
        if (!objectData[test_type]) {
          objectData[test_type] = {};
        }
        if (!objectData[test_type][result]) {
          objectData[test_type][result] = 0;
        }
        objectData[test_type][result]++;

        // Marcar este DUT como procesado
        processed[dut_no] = true;
      }
    }

    // Mapear los datos y generar las etiquetas
    const sortedData = Object.entries(objectData)
      .flatMap(([testType, reasons]) =>
        Object.entries(reasons).map(([reason, count]) => ({
          testType,
          reason,
          count,
          label: `${testsViewParameters[testType]?.name || testType} (${count}) - ${reason}`
        }))
      )
      .sort((a, b) => a.count - b.count);  // Ordenar de menor a mayor por la cantidad de fallas

    console.log('sortedData:', sortedData); // Para debug

    // Devuelvo solo los datos ordenados temporalmente para el gráfico
    return {
      data: sortedData.map(item => item.count),
      labels: sortedData.map(item => item.label)
    };
  }, [selectedTest]);

  // Asegurarse de que no haya NaN en los datos
  const dataObject = {
    labels: [
      ...labels,
      `Non-420 (${selectedTest.relays_failed_non_420 || 0})`
    ],
    datasets: [
      {
        stack: 1,
        label: "System 420",
        data: [
          ...data,
        ],
        backgroundColor: "#B3001B",
        fontColor: "black",
        borderColor: "rgb(201, 203, 207)",
        borderWidth: 1,
        categoryPercentage: 1,
      },
      {
        stack: 1,
        label: "Non-420",
        data: [
          ...labels.map(() => 0),
          selectedTest.relays_failed_non_420 || 0, // Asegurando que no sea NaN
        ],
        backgroundColor: printing ? 
          pattern.draw('square', "#FB8B24") 
          : 
          ["#FB8B24"],
        fontColor: "black",
        borderColor: "rgb(201, 203, 207)",
        borderWidth: 1,
        categoryPercentage: 1,
      },
    ],
  };

  // Opciones del gráfico
  const options = {
    animation: {
      duration: printing ? 0 : 1000
    },
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: 'black',
          font: {
            size: printing ? 12 : 12,
          },
        },
      },
      y: {
        ticks: {
          color: 'black',
          stepSize: 1,
          font: {
            size: printing ? 12 : 12,
          },
        },
      },
    },
  };

  return (
    <Bar data={dataObject} options={options} id="pareto-chart" />
  );
}
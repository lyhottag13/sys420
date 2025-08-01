import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import TestSelector from "../../components/testSelector";
import NotFound from "../../components/notFound";
// import PrintResume from '../../components/print/reporting/printResume';
import dynamic from 'next/dynamic';
import { useEffect } from "react";

const PrintResume = dynamic(() => import('../../components/print/reporting/printResume'), {
  ssr: false,
});

import { useTestsStore } from "../../store/testsContext";


/**
 * The Summary component displays detailed information and summary statistics of a selected test.
 * 
 * It checks if a test is selected from the global state. If not, it renders a NotFound component.
 * Otherwise, it presents a summary including test details like part number, application, revision,
 * and production test information such as ID, PLT, and DC. It also displays a summary of test results
 * including the number of relays tested, passed, failed, and the final yield among others.
 * 
 * Uses TestSelector for selecting tests, and PrintResume for printing the test summary.
 * 
 * @returns {JSX.Element} The summary page including test information, test summary statistics, and options for printing the summary.
 */
export default function Summary() {
  const { currentSearch, toggleTestSelection } = useTestsStore();

  // Selects the first test if no tests are selected
  useEffect(() => {
    if (
      currentSearch.tests &&
      currentSearch.tests.length > 0 &&
      (!currentSearch.selectedTests || currentSearch.selectedTests.length === 0)
    ) {
      toggleTestSelection([currentSearch.tests[0]]);
    }
  }, [currentSearch.tests, currentSearch.selectedTests, toggleTestSelection]);

  // const { currentSearch: { selectedTests = [] } } = useTestsStore();
  // Map selected IDs to test objects
  const selectedTestObjects = currentSearch.selectedTests ?? [];
  console.log(selectedTestObjects);
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`;
  };

  // If no tests are selected, show NotFound
  // if (!selectedTestObjects || selectedTestObjects.length === 0)
  //   return <NotFound />;
  console.log(selectedTestObjects);
  const totalRelaysTested = selectedTestObjects.reduce(
    (acc, test) => acc + Number(test.relays_tested || 0),
    0
  );
  const totalRelaysPassed = selectedTestObjects.reduce(
    (acc, test) => acc + Number(test.relays_passed_420 || 0),
    0
  );

  const totalFinalYield = selectedTestObjects.reduce(
    (acc, test) => acc + Number(test.final_yield || 0),
    0
  );
  const totalIssueYield = selectedTestObjects.reduce(
    (acc, test) => acc + Number(test.issue_yield || 0),
    0
  );
  const totalRelaysFailedNon420 = selectedTestObjects.reduce(
    (acc, test) => acc + Number(test.relays_failed_non_420 || 0),
    0
  );
  const totalRelaysFailed = selectedTestObjects.reduce(
    (acc, test) => acc + Number(test.relays_failed_420 || 0),
    0
  );
  const combinedData = {
    filename: selectedTestObjects.map(t => t.filename).join(", "),
    id: selectedTestObjects.map(t => t.id).join(", "),
    plt: selectedTestObjects.map(t => t.plt).join(", "),
    datecode: selectedTestObjects.map(t => t.datecode).join(", "),
    pn: selectedTestObjects[0]?.pn || "",
    application: selectedTestObjects[0]?.application || "",
    revision: selectedTestObjects[0]?.revision || "",
    relays_tested: totalRelaysTested,
    relays_passed_420: totalRelaysPassed,
    relays_failed_420: totalRelaysFailed,
    yield:
      totalRelaysTested > 0
        ? Math.round((totalRelaysPassed / totalRelaysTested) * 100)
        : 0,
    relays_failed_non_420: totalRelaysFailedNon420,
    total_quantity: selectedTestObjects.reduce(
      (acc, test) => acc + Number(test.total_quantity || 0),
      0
    ),
    reject_quantity: selectedTestObjects.reduce(
      (acc, test) => acc + Number(test.reject_quantity || 0),
      0
    ),
    // Final yield promedio (o puedes hacer ponderado si tienes cantidad)
    final_yield:
      selectedTestObjects.length > 0
        ? Math.round(100 - ((totalRelaysFailed + totalRelaysFailedNon420) / (totalRelaysTested + totalRelaysFailedNon420)) * 100)
        : 0,
    issue_quantity: selectedTestObjects.reduce(
      (acc, test) => acc + Number(test.issue_quantity || 0),
      0
    ),
    // Issue yield promedio (o puedes hacer ponderado si tienes cantidad)
    issue_yield:
      selectedTestObjects.length > 0
        ? Math.round(totalIssueYield / selectedTestObjects.length)
        : 0,
    elapsed_time: secondsToTimeString(
      selectedTestObjects.reduce(
        (acc, test) => acc + timeStringToSeconds(test.elapsed_time),
        0
      )
    ),
    idle_time: secondsToTimeString(
      selectedTestObjects.reduce(
        (acc, test) => acc + timeStringToSeconds(test.idle_time),
        0
      )
    ),
    test_time: secondsToTimeString(
      selectedTestObjects.reduce(
        (acc, test) => acc + timeStringToSeconds(test.test_time),
        0
      )
    ),
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
      <Head>
        <title>SYSTEM 420 - Summary</title>
        <link rel="icon" href="/icon.ico" />
      </Head>
      <Header />

      <section className="w-full flex flex-col items-center">
        <div className="w-full pt-8 pb-5 border-b-2 border-t-2 border-gray-300 text-center">
          <h2 className="text-4xl">Test Information</h2>
        </div>
        <label htmlFor="test-select">Select Test</label>
        <TestSelector />




        {/* Totals Section */}
        <div className="w-full flex flex-col items-center my-8">
          <h2 className="text-4xl font-bold">Test Summary</h2>
          <div className="w-full max-w-5xl mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 gap-y-5 text-xl">
              <div className="flex flex-col items-center space-y-1">
                <h3 className="font-bold">COTO SYSTEM 420</h3>
                <p>PN: {combinedData?.pn}</p>
                <p>APPL: {combinedData?.application}</p>
                <p>REV#: {combinedData?.revision}</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <h3 className="font-bold">Normal Production Test</h3>
                <p>FILENAME: {combinedData?.filename}</p>
                <p>PLT: {combinedData?.plt}</p>
                <p>DC: {combinedData?.datecode}</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <h3 className="font-bold">COTO Technology</h3>
                <p>
                  START DATE:{" "}
                  {selectedTestObjects[0]?.start_datetime
                    ? formatDate(selectedTestObjects[0].start_datetime.slice(0, 10))
                    : ""}
                </p>
                <p>
                  START TIME:{" "}
                  {selectedTestObjects[0]?.start_datetime
                    ? selectedTestObjects[0].start_datetime.slice(11, 19)
                    : ""}
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col items-center text-xl my-5 space-y-6 px-3">
              {/* SYSTEM 420 */}
              <div className="w-full flex flex-col space-y-2">
                <h3 className="font-bold">SYSTEM 420</h3>
                <div className="flex ml-3">
                  <p>Relays tested</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.relays_tested}</span>
                </div>
                <div className="flex ml-3">
                  <p>Relays passed</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.relays_passed_420}</span>
                </div>
                <div className="flex ml-3">
                  <p>Relays failed</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.relays_failed_420}</span>
                </div>
                <div className="flex ml-3">
                  <p>Yield</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.yield}%</span>
                </div>
              </div>
              {/* NON 420 */}
              <div className="w-full flex flex-col space-y-2">
                <h3 className="font-bold">NON 420</h3>
                <div className="flex ml-3">
                  <p>Non 420 rejects</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.relays_failed_non_420}</span>
                </div>
              </div>
              {/* FINAL YIELD */}
              <div className="w-full flex flex-col space-y-2">
                <h3 className="font-bold">FINAL YIELD</h3>
                <div className="flex ml-3">
                  <p>Total quantity</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.total_quantity}</span>
                </div>
                <div className="flex ml-3">
                  <p>Reject quantity</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.reject_quantity}</span>
                </div>
                <div className="flex ml-3">
                  <p>Final yield</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.final_yield}%</span>
                </div>
              </div>
              {/* ISSUE YIELD */}
              <div className="w-full flex flex-col space-y-2">
                <h3 className="font-bold">ISSUE YIELD</h3>
                <div className="flex ml-3">
                  <p>Issue quantity</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.issue_quantity}</span>
                </div>
                <div className="flex ml-3">
                  <p>Issue yield</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.issue_yield}</span>
                </div>
              </div>
              {/* TIME */}
              <div className="w-full flex flex-col space-y-2">
                <h3 className="font-bold">TIME</h3>
                <div className="flex ml-3">
                  <p>Elapsed time</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.elapsed_time}</span>
                </div>
                <div className="flex ml-3">
                  <p>Idle time</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.idle_time}</span>
                </div>
                <div className="flex ml-3">
                  <p>Test time</p>
                  <div className="border-b-2 border-gray-400 border-dotted flex-grow mb-1.5 mx-2" />
                  <span>{combinedData?.test_time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      {/* Pass the array of selected tests to PrintResume */}
      <PrintResume testsArray={selectedTestObjects} totals={combinedData} />
    </div>
  );
}

function timeStringToSeconds(timeStr) {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(":").map(Number);
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
}

function secondsToTimeString(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

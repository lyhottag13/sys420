import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import TestSelector from "../../components/testSelector";
import NotFound from "../../components/notFound";
import PrintResume from '../../components/print/reporting/printResume';

import { useTestsStore } from "../../store/testsContext";
import MainHistogramContainer from '../../components/charts/mainHistogramsContainer';

/**
 * Displays the Charts page with a histogram and other related components based on the selected test.
 * 
 * The 'Charts' component utilizes the global state managed by 'useTestsStore' to access the currently selected test. 
 * If no test is selected, it displays a 'NotFound' component. Otherwise, it renders the page with a header, 
 * a test selector, the main histogram for the selected test, and a footer. Additionally, a print resume 
 * component is included but not visibly rendered until triggered for printing.
 * 
 * @component
 * @returns {JSX.Element} The Charts page component, which includes the header, test selector, main histogram container for the selected test, footer, and a print resume component.
 */

export default function Charts() {
  const { currentSearch } = useTestsStore();

  if (!currentSearch.selectedTest) return <NotFound />;

  return (
    <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
      <Head>
        <title>SYSTEM 420 - Charts</title>
        <link rel="icon" href="/icon.ico" />
        <link rel="stylesheet" href="../tailwind.css" />
      </Head>

      <Header />

      <main className="w-full flex flex-col items-center flex-grow mb-6">
        <div className="w-full pt-8 pb-5 border-b-2 border-gray-300 text-center">
          <h2 className="text-4xl">Charts</h2>
        </div>

        <TestSelector />

        <div className="w-full mx-3 max-w-7xl">
          <MainHistogramContainer selectedTest = {currentSearch.selectedTest}/> 
        </div>
      
      </main>

      <Footer />
      <PrintResume selectedTest={currentSearch.selectedTest} testsArray={currentSearch.tests}/>
    </div>
  );
}

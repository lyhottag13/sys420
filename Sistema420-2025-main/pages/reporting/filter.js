import Head from 'next/head';
import Header from "../../components/header";
import Footer from "../../components/footer";


import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTestsStore } from "../../store/testsContext";
import Loader from '../../components/loader';


/**
 * A functional component that renders a filter form for searching test results.
 * 
 * The 'Filter' component allows users to input search criteria such as test ID, part number, application type, 
 * test date range, PLT number, and yield range to filter test results. Upon submitting the form, it updates the
 * global search parameters using 'updateParams' from 'useTestsStore' and navigates to the summary report page 
 * if tests matching the criteria are found. The component displays a loader animation while a new search is 
 * being processed.
 * 
 * @component
 * @example
 * return <Filter />
 * 
 * @returns {JSX.Element} The Filter form component wrapped in a layout that includes a header and a footer.
 */
export default function Filter() {
  const router = useRouter();
  const [params, setParams] = useState({ filename: '', id: '', application: 'FINAL', start_datetime1: (new Date()).toISOString().substring(0, 10), start_datetime2: (new Date()).toISOString().substring(0, 10), yield1: 0, yield2: 100 });
  const { currentSearch, updateParams } = useTestsStore();
  const [isNewSearch, setIsNewSearch] = useState(false);
  /*
    Keeps track of whether the user came from the LabView app to prevent submissions
    every single time the user updates the parameters.
  */
  const [fromApp, setFromApp] = useState(false);

  /**
   * Handles form submission, updates search parameters, and triggers a new search.
   * 
   * @param {Event} e - The event object associated with the form submission.
   */
  async function handlerSubmit(e) {
    e?.preventDefault();
    setIsNewSearch(true);
    await updateParams(params);
  }
  // Effect hook to use the URL's filename if there is any. This happens when the user comes from the LabView app.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('filename')) {
      setFromApp(true);
      setParams({ ...params, filename: urlParams.get('filename') });
    }
  }, []);
  useEffect(() => {
    if (params.filename && fromApp) {
      handlerSubmit();
    }
  }, [params]);
  // Effect hook to navigate to the summary report page after a successful search.
  useEffect(() => {
    if (!isNewSearch) return;
    setIsNewSearch(false);

    if (currentSearch.tests.error) return alert(currentSearch.tests.error);
    if (currentSearch.tests.length < 1) return alert('Sorry, there are no tests that matches your params.');
    // Adds the 'fromApp flag if we came from the app. It helps later to automatically start the printing process.
    fromApp && router.push('/reporting/summary?fromApp=true');
    router.push('/reporting/summary');
    
  }, [currentSearch])

  return (
    <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
      <Head>
        <title>SYSTEM 420 - Filter</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <Header />

      <main className="flex-grow flex flex-col w-full items-center gap-y-4 mb-6">
        <div className="pt-8 pb-5 border-b-2 border-gray-300 w-full text-center">
          <h1 className="text-4xl">Filter</h1>
        </div>

        <p>Search for tests results.</p>

        <div className="flex justify-center items-center px-3">
          <form className="w-full max-w-xl bg-gray-300 py-5 px-8">
            <div className="flex flex-col items-left mb-7">
              <label className="block text-black text-lg" htmlFor="filename">Filename</label>
              <input id="filename" name="filename" onChange={(e) => { setParams({ ...params, filename: e.target.value }) }} className="border-b border-black focus:border-blue-500 text-lg bg-transparent w-full text-gray-700 py-1 leading-tight focus:outline-none" type="text" placeholder="#" />
            </div>
            <div className="flex items-center justify-center my-7">
              <span>- or -</span>
            </div>
            <div className="flex flex-col items-left mb-7">
              <label className="block text-black text-lg" htmlFor="partNumber">Part Number</label>
              <input id="partNumber" name="partNumber" onChange={(e) => { setParams({ ...params, pn: e.target.value }) }} className="border-b border-black focus:border-blue-500 text-lg bg-transparent w-full text-gray-700 py-1 leading-tight focus:outline-none" type="text" placeholder="0000-0000" />
            </div>
            <div className="flex flex-col items-left mb-7">
              <label className="block text-black text-lg" htmlFor="application">Application</label>
              <div className="relative">
                <input placeholder="Final" type="text" list="application" onChange={(e) => { setParams({ ...params, application: e.target.value }) }} className="appearance-none border-b border-black focus:border-blue-500 outline-none w-full bg-gray-300 text-gray-700 py-3 leading-tight uppercase" />
                <datalist id="application">
                  <option>Final</option>
                  <option>Customer</option>
                  <option>Incoming</option>
                  <option>Pretest</option>
                  <option>Reset</option>
                  <option>Sort</option>
                  <option>Set</option>
                </datalist>
                {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div> */}
              </div>
            </div>
            <div className="flex flex-col items-left mb-7">
              <label className="block text-black text-lg" htmlFor="testDate">Test Date</label>
              <div className="flex justify-between space-x-3">
                <input id="testDate1" name="testDate1" onChange={(e) => { setParams({ ...params, start_datetime1: e.target.value }) }} className="border-b border-black focus:border-blue-500 text-lg bg-transparent w-full text-gray-700 py-1 leading-tight focus:outline-none" type="date" value={params.start_datetime1} />
                <span>-</span>
                <input id="testDate2" name="testDate2" onChange={(e) => { setParams({ ...params, start_datetime2: e.target.value }) }} className="border-b border-black focus:border-blue-500 text-lg bg-transparent w-full text-gray-700 py-1 leading-tight focus:outline-none" type="date" value={params.start_datetime2} />
              </div>
            </div>
            <div className="flex flex-col items-left mb-7">
              <label className="block text-black text-lg" htmlFor="pltNumber">PLT Number</label>
              <input id="pltNumber" name="pltNumber" onChange={(e) => { setParams({ ...params, plt: e.target.value }) }} className="border-b border-black focus:border-blue-500 text-lg bg-transparent w-full text-gray-700 py-1 leading-tight focus:outline-none" type="number" placeholder="0" />
            </div>
            <div className="flex flex-col items-left mb-7">
              <label className="block text-black text-lg" htmlFor="yield">Yield</label>
              <div className="flex justify-between space-x-3">
                <input id="yield1" name="yield1" value={params.yield1} onChange={(e) => { setParams({ ...params, yield1: e.target.value }) }} className="border-b border-black focus:border-blue-500 text-lg bg-transparent w-full text-gray-700 py-1 leading-tight focus:outline-none" type="number" placeholder="0" />
                <span>-</span>
                <input id="yield2" name="yield2" value={params.yield2} onChange={(e) => { setParams({ ...params, yield2: e.target.value }) }} className="border-b border-black focus:border-blue-500 text-lg bg-transparent w-full text-gray-700 py-1 leading-tight focus:outline-none" type="number" placeholder="0" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <button onClick={handlerSubmit} className="bg-red-900 w-11/12 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Search</button>
            </div>
          </form>
        </div>
      </main>

      {
        isNewSearch &&
        <Loader />
      }


      <Footer />
    </div>
  )
}

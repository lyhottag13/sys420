import Head from 'next/head';
import Header from "../../components/header";
import Footer from "../../components/footer";


import {useRouter} from 'next/router';
import {useState, useEffect} from 'react';
import Loader from '../../components/loader';

import { useSpecificationsStore } from '../../store/specificationsContext';


/**
 *
 * Home page component for the System 420 application.
 *
 * @returns {JSX.Element} The home page component.
 */
export default function Home() {
  const router = useRouter();
  const [params, setParams] = useState({ pn: '', application: 'FINAL' });
  const [isNewSearch, setIsNewSearch] = useState(false);

  const { specifications, getSpecifications } = useSpecificationsStore();

  async function handlerSubmit(e){
    e.preventDefault();  

    setIsNewSearch(true);
    await getSpecifications(params);
  }

  //Redirects to view specifications page after successful search.
  useEffect(()=>{
    if(!isNewSearch) return;
    setIsNewSearch(false);

    if(specifications.error) return alert(specifications.error);
    if(!specifications.pn) return alert('Sorry, there are no tests that matches your paramssss.');

    router.push('/specifications/viewSpecs')
  },[specifications])

  return (
    <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
      <Head>
        <title>SYSTEM 420 - Filter</title>
        <link rel="icon" href="/icon.ico" />
        <link rel="stylesheet" href="../tailwind.css" />
      </Head>

      <Header />

      <main className="flex-grow flex flex-col w-full gap-y-4 items-center mb-6">
        <div className="pt-8 pb-5 border-b-2 border-gray-300 w-full text-center">
          <h1 className="text-4xl">Filter</h1>
        </div>

        <p>Search for test specifications.</p>

        <div className="flex justify-center items-center px-3 w-full">
          <form className="w-full max-w-xl bg-gray-300 py-5 px-8">
            <div className="flex flex-col items-left mb-7">
              <label className="block text-black text-lg" htmlFor="partNumber">Part Number</label>
              <input id="partNumber" name="partNumber" onChange={(e)=> {setParams({...params, pn: e.target.value})}} className="border-b border-black focus:border-blue-500 text-lg bg-transparent w-full text-gray-700 py-1 leading-tight focus:outline-none" type="text" placeholder="0000-0000"/>
            </div>
            <div className="flex flex-col items-left mb-7">
              <label className="block text-black text-lg" htmlFor="application">Application</label>
              <div className="relative">
                <input placeholder="Final" type="text" list="application" onChange={(e)=> {setParams({...params, application: e.target.value})}} className="appearance-none border-b border-black focus:border-blue-500 outline-none w-full bg-gray-300 text-gray-700 py-3 leading-tight uppercase"/>
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

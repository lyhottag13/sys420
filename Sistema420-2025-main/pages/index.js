import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import {useRouter} from 'next/router';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [userHasAccount, setUserHasAccount] = useState(true);

  function handleSubmit(e){
    e.preventDefault();
    router.push({pathname: '/filter'});
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden">
      <Head>
        <title>420 System</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <Header hide={true}/>

      <main className="w-full flex flex-col items-center flex-grow border b-0 bt-1 py-7">
        <h1 className='text-2xl font-bold'>System 420</h1>
        <div className='flex flex-col gap-x-8 gap-y-12 lg:flex-row lg:justify-around w-full max-w-7xl px-2'>
          <Link href="/specifications/filter" legacyBehavior>
            <a className='w-full transform hover:scale-105 hover:underline'>
              <div className='flex flex-col items-center w-full'>
                <h2 className='text-2xl transform'>Test Specifications</h2>
                <div className='max-w-2xl w-full'>
                  <img className='max-h-80 transform object-cover w-full h-full border ' src="/images/specifications-cover.png"/>
                </div>
              </div>
            </a>
          </Link>
          <Link href="/reporting/filter" legacyBehavior>
          <a className='w-full transform hover:scale-105 hover:underline'>
              <div className='flex flex-col items-center w-full'>
                <h2 className='text-2xl transform'>Reporting System</h2>
                <div className='max-w-2xl w-full'>
                  <img className='max-h-80 transform object-cover w-full h-full border ' src="/images/reporting-cover.jpg"/>
                </div>
              </div>
            </a>
          </Link>
        </div>
      </main>

      <Footer hide={true}/>
      
    </div>
  )
}

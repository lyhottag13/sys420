import Head from 'next/head';
import Header from '../components/header/';
import Footer from '../components/footer';
import Loader from '../components/loader';
import {useRouter} from 'next/router';
import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userContext';

export default function Home() {
  const router = useRouter();
  const { user, login } = useUserStore();

  const [ userData, setUserData ] = useState({username: '', first_name: '', last_name: '', password: ''});
  const [isNewLogin, setIsNewLogin] = useState(false);

  useEffect(()=>{
    setIsNewLogin(false);

    if(user.username) router.push({pathname: router.query.lastPath == "/login"? "/" : router.query.lastPath});
  },[user]);

  const submitHandler = (e) => {
    e.preventDefault();
    login(userData);
    setIsNewLogin(true);
  }
  const fieldChangeHandler = (e) => {
    e.preventDefault();

    let newUserData = {...userData, };
    newUserData[e.target.id] = e.target.value;
    setUserData(newUserData);
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen">
      <Head>
        <title>420 System</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <Header/>

      <main className="w-full flex flex-col items-center flex-grow">
        <div className="bg-black w-full text-white text-center p-10 text-3xl font-berlin space-y-6">
          <p>420 System</p>
          <p>Login to your account</p>
        </div>
        <div className="w-full bg-gray-500 flex justify-center items-center px-2 py-16 sm:py-8 flex-grow">
          <form className="w-full bg-gray-400 max-w-md shadow-md rounded px-5 pt-6 pb-8 flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <label className="block text-black font-bold " htmlFor="username">Username</label>
              <input onChange={fieldChangeHandler} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
            </div>

    
            <div className="flex flex-col gap-y-1">
              <label className="block text-black font-bold " htmlFor="password">Password</label>
              <input onChange={fieldChangeHandler} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
            </div>

            
            <div className="flex flex-col items-center justify-between space-y-3">
              <button onClick={submitHandler} className="bg-red-900 w-11/12 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">Log In</button>
            </div>
          </form>
        </div>
      </main>

      <Footer/>
      
      {
        isNewLogin && 
        <Loader />
      }
    </div>
  )
}

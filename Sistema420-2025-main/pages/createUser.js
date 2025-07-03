import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import Loader from '../components/loader';
import NotFound from '../components/notFound';
import { useState, useEffect } from 'react';

import { useUserStore } from '../store/userContext';
/**
 *This function renders a form for user registration on the home page, 
 *allowing users to input their information and submit it for processing.
 * 
 * @returns {JSX.Element} The home page component.
 */
export default function Home() {
  const { user } = useUserStore();
  if( !user.username ) return <NotFound />

  const [ userData, setUserData ] = useState({username: '', first_name: '', last_name: '', password: '', user_type: 'operator'});
  const [isNewRegister, setIsNewRegister] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsNewRegister(true);

    const response = await fetch('/api/user', {
      method: 'POST', 
      body: JSON.stringify(userData), 
      headers:{
      'Content-Type': 'application/json'
      }
    });
    const user = await response.json();

    // if(user.username) alert (`User created.\nUsername: ${user.username}.\nPassword:${user.password}. `);
    if(user.username) alert ('User created succesfully.');
    else              alert('There was an error. User could not be created.')

    setIsNewRegister(false);
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
          <p>Register a new user</p>
        </div>
        <div className="w-full bg-gray-500 flex justify-center items-center px-2 py-16 sm:py-8 flex-grow">
          <form className="w-full bg-gray-400 max-w-md shadow-md rounded px-5 pt-6 pb-8 flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <label className="block text-black font-bold " htmlFor="username">Username</label>
              <input onChange={fieldChangeHandler} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
            </div>

            <div className="flex flex-col gap-y-1">
              <label className="block text-black font-bold " htmlFor="first_name">First name</label>
              <input onChange={fieldChangeHandler} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" id="first_name" type="text" placeholder="First Name"/>
            </div>

            <div className="flex flex-col gap-y-1">
              <label className="block text-black font-bold " htmlFor="last_name">Last name</label>
              <input onChange={fieldChangeHandler} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" id="last_name" type="text" placeholder="Last Name"/>
            </div>

            <div className="flex flex-col gap-y-1">
              <label className="block text-black font-bold " htmlFor="last_name">User Type</label>
              <select onChange={fieldChangeHandler} name="user_type" id="user_type" className="shadow border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline hover:cursor-pointer">
                <option value="operator">Operator</option>
                <option value="admin">Admin</option>
              </select>
            </div>


            <div className="flex flex-col gap-y-1">
              <label className="block text-black font-bold " htmlFor="password">Password</label>
              <input onChange={fieldChangeHandler} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
            </div>

            
            <div className="flex flex-col items-center justify-between space-y-3">
              <button onClick={submitHandler} className="bg-red-900 w-11/12 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">Register user</button>
            </div>
          </form>
        </div>
      </main>

      <Footer/>
      

      {
        isNewRegister && 
        <Loader />
      }
    </div>
  )
}

import Link from 'next/link'; // Importing Link from next/link for potential navigation.

// Initial array for decoding secret message.
const arr1 = [66, 69, 84, 79, 45, 67, 80, 85];
const arr2 = [70, 65, 83, 67, 71]; // ASCII for 'FASCG'
const arr3 = [84, 104, 101, 32, 103, 111, 111, 100, 32, 102, 111, 108, 107, 115, 32, 111, 102, 32, 65, 114, 105, 122, 111, 110, 97, 46];
import { useState, useEffect } from 'react'; // Importing useState and useEffect hooks from react.

/**
 * Footer component that dynamically updates the designer's name on click events.
 * It showcases an easter egg that changes the displayed name to a secret message 
 * after a specific number of clicks and resets afterwards.
 */
export default function Footer() {
  const [fun, setFun] = useState(true);
  const [counter, setCounter] = useState(0); // State to keep track of click count.
  const [by, setBy] = useState('CETYS UNIVERSITY'); // State to display the designer's name or a secret message.

  useEffect(() => {
    if (!fun) {
      return;
    }
    if (counter === 3) {
      // Decodes and sets the designer's name to the original secret message.
      setBy(String.fromCharCode(...arr1));
    }
    if (counter === 13) {
      // Decodes and sets the designer's name to a new secret message.
      setBy(String.fromCharCode(...arr2));
    }
    if (counter === 33) {
      // Changes the designer's name to a newer secret message.
      setBy(String.fromCharCode(...arr3));
    }
    if (counter === 50) {
      // Resets the counter. Secret's over!
      setFun(false);
      setBy('CETYS UNIVERSITY');
    }
  }, [counter]); // Effect runs on counter state updates.

  return (
    <div className="flex flex-col w-full bg-red-900 items-center px-2">
      <div className="w-full flex max-w-7xl mx-0 flex-col lg:flex-row text-center justify-between py-12 text-white text-lg sm:text-xl">
        <p>©2021 COTO TECHNOLOGY. ALL RIGHTS RESERVED.</p>
        <br />
        {/* Increases counter by 1 each time this paragraph is clicked, potentially triggering the easter egg. */}
        <p onClick={() => { setCounter(counter + 1) }}>DESIGNED BY: {by}</p>
      </div>
    </div>
  )
}
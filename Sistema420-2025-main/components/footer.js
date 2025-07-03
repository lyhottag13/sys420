import Link from 'next/link'; // Importing Link from next/link for potential navigation.

// Initial array for decoding secret message.
const arr = [70,65,83,67,71]; // ASCII for 'FASCG'
import { useState, useEffect } from 'react'; // Importing useState and useEffect hooks from react.

/**
 * Footer component that dynamically updates the designer's name on click events.
 * It showcases an easter egg that changes the displayed name to a secret message 
 * after a specific number of clicks and resets afterwards.
 */
export default function Footer() {
  const [counter, setCounter] = useState(0); // State to keep track of click count.
  const [by, setBy] = useState('CETYS UNIVERSITY'); // State to display the designer's name or a secret message.

  useEffect(() => {
    if (counter === 13) {
      // Decodes and sets the designer's name to a secret message when counter is 21.
      setBy(String.fromCharCode(...arr));
    }
    if (counter === 33) {
      // Resets the counter (and thus, the easter egg) when it reaches 33.
      setCounter(0);
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
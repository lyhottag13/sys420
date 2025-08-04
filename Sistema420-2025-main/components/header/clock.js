import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleString());
    const intervalID = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  return <span>{time}</span>;
};

export default Clock;
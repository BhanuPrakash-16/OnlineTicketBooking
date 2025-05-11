import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Screen = ({ theaterId }) => {
  const [screenName, setScreenName] = useState('');

  const createScreen = async () => {
    await axios.post('http://localhost:7004/api/screens', {
      screenName,
      theater: { id: theaterId },
    });
    alert('Screen created');
  };

  return (
    <div>
      <input placeholder="Screen Name" onChange={(e) => setScreenName(e.target.value)} />
      <button onClick={createScreen}>Add Screen</button>
    </div>
  );
};

export default Screen;

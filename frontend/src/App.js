import React, { useState } from 'react';

function App() {
    const [message, setMessage] = useState(''); // tila viestille

    const fetchMessage = async() => {
	try {
	    const response = await fetch ('http://localhost:5202/api/test'); //backend endpoint
	    const data = await response.json(); // muuttaa JSON-vastauksen JS-objektiksi
	    setMessage(data.message); // tallentaa viestin
	  } catch (error) {
            console.error('Virhe haettaessa viestiä:', error);
            setMessage('Virhe haettaessa viestiä');
    }
  };

    return (
	<div style={{ padding: '2rem' }}>
	    <h1>Backend-viesti:</h1>
	    <button onClick={fetchMessage}>Hae viesti</button>
	    <p>{message}</p>
	</div>
  );
}

export default App;


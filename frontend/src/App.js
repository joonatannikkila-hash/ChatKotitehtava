import React, { useState } from 'react';

function App() {
    const [message, setMessage] = useState(''); // tila viestille

    const fetchMessage = async() => {
	try {
		console.log("Lähetetään pyyntö backendille...");
	    const response = await fetch('http://localhost:5202/api/message', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({message:"Kerro vitsi ohjelmoijasta"}),});


	    const data = await response.json(); // muuttaa JSONin 
		console.log("Vastaus backendiltä:", data);
	    setMessage(data.response); // tallentaa viestin
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


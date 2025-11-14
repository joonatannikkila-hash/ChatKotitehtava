import React, { useState } from 'react';

function App() {
	const [inputMessage, setInputMessage] = useState(''); // käyttäjän viesti
	const [responseMessage, setResponseMessage] = useState(''); // vastaus

    const sendMessage = async() => {
		if(inputMessage.trim==="") {
			setResponseMessage("Kirjoita viesti ennen lähettämistä.");
			return;
		}
		try {
			console.log("Lähetetään viesti backendille...");
		    const response = await fetch('http://localhost:5202/api/message', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({message:inputMessage}),
		});
		const data = await response.json();
		console.log("Vastaus backendiltä:", data);
		setResponseMessage(data.response);
	    } catch (error) {
		console.error('Virhe lähetettäessä viestiä:', error);
		setResponseMessage('Virhe lähetettäessä viestiä');
		}
	};

	
	return (
		<div style={{ padding: '2rem' }}>
		  <h1>Chat Gemini-botin kanssa</h1>
		  <input
			type="text"
			placeholder="Kirjoita viesti..."
			value={inputMessage}
			onChange={(e) => setInputMessage(e.target.value)}
			style={{ width: '300px', marginRight: '10px' }}
		  />
		  <button onClick={sendMessage}>Lähetä</button>
		  <p>{responseMessage}</p>
		</div>
	  );
	
}

export default App;
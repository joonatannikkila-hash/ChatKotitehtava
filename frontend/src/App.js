import React, { useState } from 'react';

function App() {
    const [inputMessage, setInputMessage] = useState(''); 
    const [responseMessage, setResponseMessage] = useState('');
    const [history, setHistory] = useState([]); // <-- kaikki kysymykset ja vastaukset

    const sendMessage = async () => {
        if (inputMessage.trim() === "") {
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
                body: JSON.stringify({ message: inputMessage }),
            });

            const data = await response.json();
            console.log("Vastaus backendiltä:", data);

            // Näytetään vastaus
            setResponseMessage(data.response);

            // Tallennetaan historiaan "kysymys + vastaus"
            setHistory(prev => [
                ...prev,
                { question: inputMessage, answer: data.response }
            ]);

        } catch (error) {
            console.error('Virhe lähetettäessä viestiä:', error);
            setResponseMessage('Virhe lähetettäessä viestiä');
        }
    };

    // Kun käyttäjä klikkaa vasemmalta historiaa
    const loadHistoryItem = (item) => {
        setInputMessage(item.question);
        setResponseMessage(item.answer);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>

            {/* VASEN HISTORIALISTA */}
            <div style={{
                width: '250px',
                borderRight: '1px solid #ccc',
                padding: '1rem',
                overflowY: 'auto'
            }}>
                <h3>Aiemmat kysymykset</h3>

                {history.length === 0 && (
                    <p style={{ fontStyle: 'italic', color: '#666' }}>
                        Ei vielä keskusteluja...
                    </p>
                )}

                {history.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => loadHistoryItem(item)}
                        style={{
                            padding: '8px',
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer'
                        }}
                    >
                        {item.question}
                    </div>
                ))}
            </div>

            {/* VARSINAINEN CHAT */}
            <div style={{ flex: 1, padding: '2rem' }}>
                <h1>Chat Gemini-botin kanssa</h1>

                <input
                    type="text"
                    placeholder="Kirjoita viesti..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    style={{ width: '300px', marginRight: '10px' }}
                />

                <button onClick={sendMessage}>Lähetä</button>

                <p style={{ marginTop: '1rem' }}>
                    {responseMessage}
                </p>
            </div>

        </div>
    );
}

export default App;

"use client";
import { useState, useEffect } from 'react';

const Customer = () => {
    const [ticketValue, setTicketValue] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const CLOUD_ID = "40ea3d962ab44122a9a5a19bd0c1d9d5:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJDM2MjBmZWIwMDJlNjQyODE4ODI5Y2IzNzk5YmJmMjU1JGM2ZDg1Zjk4ZTc2OTQ3MzA5NDBlYzc3ODc1NjczMDgw";
    const API_KEY = "M3VlNFpaQUJYcHIwdjV4eGhVeUU6bWlVRGhuZW5UV0NMNGlvUWtzcDIxUQ==";
    const ES_ENDPOINT = "https://3620feb002e642818829cb3799bbf255.us-central1.gcp.cloud.es.io"

    useEffect(() => {
        // Fetch price from Elasticsearch
        const fetchPrice = async () => {
            try {
                const response = await fetch(`${ES_ENDPOINT}/price/_search?size=1`, {
                    headers: {
                        'Authorization': `ApiKey ${API_KEY}`
                    },
                    mode: 'no-cors'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch price from Elasticsearch');
                }

                const data = await response.json();
                if (data.hits.hits.length > 0) {
                    setTicketValue(data.hits.hits[0]._source.price);
                }
            } catch (error) {
                console.error("Error fetching price:", error);
                setErrorMessage("Error fetching price. Please try again.");
            }
        };

        fetchPrice(); // Initial fetch
        const intervalId = setInterval(fetchPrice, 5000); // Update every 5 seconds

        return () => clearInterval(intervalId); 
    }, []);

    const handleConfirmTransaction = async () => {
        // ... (Simulate payment - replace with actual payment logic)

        try {
            const response = await fetch(`${ES_ENDPOINT}/transactions/_doc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `ApiKey ${API_KEY}`
                },
                body: JSON.stringify({ ticketValue, phoneNumber })
            });

            if (!response.ok) {
                throw new Error('Failed to save transaction in Elasticsearch');
            }

            setPaymentConfirmed(true);
            setErrorMessage(null); // Clear any previous error message
        } catch (error) {
            console.error("Error saving transaction:", error);
            setErrorMessage("Error saving transaction. Please try again.");
        }
    };

    return (
        <div className="h-[100vh] bg-white mt-[10vh]">
            <h2>Ticket Value: ${ticketValue}</h2>
            <input 
                type="tel" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                placeholder="Phone Number" 
            />

            {/* QR Code Image (Assuming you have qr-code.png in your public folder) */}
            <img src="/qr-code.png" alt="QR Code" /> 

            <button onClick={handleConfirmTransaction} disabled={paymentConfirmed}>
                {paymentConfirmed ? 'Transaction Confirmed' : 'Confirm Transaction'}
            </button>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Optional: Show confirmation message */}
            {paymentConfirmed && <p>Payment successful! Thank you.</p>}
        </div>
    );
};

export default Customer;

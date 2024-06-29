"use client"; // This is crucial for using client-side hooks like useState and useEffect in Next.js 13 and above

import { useState, useEffect } from 'react';

const Customer = () => {
    const [ticketValue, setTicketValue] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    useEffect(() => {
        // Fetch price.csv continuously
        const fetchPrice = async () => {
            const res = await fetch('/price.csv');
            const data = await res.text();
            setTicketValue(data.trim());
        };

        fetchPrice();
        const intervalId = setInterval(fetchPrice, 5000); // Update every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    const handleConfirmTransaction = async () => {
        // 1. Simulate payment verification (Replace with actual payment integration)
        // ... (Assume payment is successful for this example)

        // 2. Save transaction to transactions.csv
        const transactionData = `${ticketValue},${phoneNumber}`;
        await fetch('/transactions.csv', {
            method: 'POST',
            body: transactionData,
        });

        setPaymentConfirmed(true);
    };

    return (
        <div>
            <h2>Ticket Value: ${ticketValue}</h2>

            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />

            {/* QR Code */}
            <img src='/your-qrcode.png' alt="QR Code" />

            <button onClick={handleConfirmTransaction} disabled={paymentConfirmed}>
                {paymentConfirmed ? 'Transaction Confirmed' : 'Confirm Transaction'}
            </button>

            {/* Optional: Show confirmation message */}
            {paymentConfirmed && <p>Payment successful! Thank you.</p>}
        </div>
    );
};

export default Customer;

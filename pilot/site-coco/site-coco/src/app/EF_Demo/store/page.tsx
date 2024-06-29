"use client"; // This is crucial for using client-side hooks like useState and useEffect in Next.js 13 and above

import { useState, useEffect } from 'react';

const Page = () => {
    const [totalPrice, setTotalPrice] = useState('');
    const [addonPercentage, setAddonPercentage] = useState('5'); 
    const [transactions, setTransactions] = useState<string[]>([]); 

    useEffect(() => {
        // Fetch price.csv on initial render
        fetch('/price.csv')
            .then(res => res.text())
            .then(data => setTotalPrice(data.trim())); 

        // Fetch transactions.csv initially and periodically
        const fetchTransactions = async () => {
            const res = await fetch('/transactions.csv');
            const data = await res.text();
            setTransactions(data.split('\n').filter(line => line.trim() !== ''));
        };

        fetchTransactions();
        const intervalId = setInterval(fetchTransactions, 5000); // Update every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    const handleSync = async () => {
        const updatedPrice = parseFloat(totalPrice) * (1 + parseFloat(addonPercentage) / 100);
        await fetch('/price.csv', {
            method: 'POST',
            body: updatedPrice.toString(),
        });
    };

    return (
        <div>
            <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />

            <select value={addonPercentage} onChange={(e) => setAddonPercentage(e.target.value)}>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
            </select>

            <button onClick={handleSync}>Sync</button>

            <h2>Transactions:</h2>
            <ul>
                {transactions.map((transaction, index) => (
                    <li key={index}>{transaction}</li>
                ))}
            </ul>
        </div>
    );
};


export default Page;
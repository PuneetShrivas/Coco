"use client";
import { useState } from 'react';

const Customer = () => {
    const [price, setPrice] = useState('');
    const [totalValue, setTotalValue] = useState(0);
    const [cashback, setCashback] = useState(0);
    const [walletBack, setWalletBack] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('');

    const calculateValues = () => {
        const priceWithAddon = parseFloat(price) * 1.5;

        if (priceWithAddon < 50) {
            setTotalValue(50);
            setCashback(5);
        } else if (priceWithAddon <= 100) {
            setTotalValue(100);
            setCashback(10);
        } else if (priceWithAddon <= 150) {
            setTotalValue(150);
            setCashback(15);
        } else {
            setTotalValue(Math.ceil(priceWithAddon / 100) * 100); // Round up to nearest 100
            setCashback(20);
        }

        setWalletBack(totalValue - parseFloat(price) + cashback);
    };

    const [isPaid, setIsPaid] = useState(false); 

    const handlePayClick = () => {
        setIsPaid(true);
    };

    return(
        <div className="mt-[5vh] bg-white h-full" style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center' 
        }}>
            <h2 style={{ marginBottom: '20px' }} className="text-green-800 text-[24px]">Get more every time!</h2>

            <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Enter Price"
                style={{
                    padding: '10px',
                    margin: '10px 0',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    width: '200px' // Add width for better styling
                }}
                onBlur={calculateValues}
            />

            {price !== '' && (
                <div style={{ marginTop: '20px' }}>
                    <p style={{ margin: '5px 0' }} className="text-green-800 text-[24px]">Pay <span style={{ fontWeight: 'bold' }}>₹{totalValue}</span></p>
                    <p style={{ margin: '5px 0' }} className="text-gray-700 text-[18px]">Get a bonus of <span className="text-green-800" style={{ fontWeight: 'bold' }}>₹{cashback}</span></p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span role="img" aria-label="gift">🎁</span> 
                        <p style={{ margin: '5px 0' }} className="text-[18px] text-gray-700"> and<span className="text-green-800" style={{ fontWeight: 'bold' }}> get ₹{totalValue - parseFloat(price) + cashback}</span> back in wallet</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <input 
                            type="tel"
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Phone Number"
                            style={{
                                padding: '10px',
                                margin: '10px 5px', // Adjust margin for spacing
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                width: '200px' 
                            }}
                        />
                        <button 
                            onClick={handlePayClick} 
                            style={{ 
                                padding: '10px 15px', 
                                backgroundColor: isPaid ? '#ccc' : '#4CAF50', 
                                color: 'white', 
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginLeft: '10px', // Adjust spacing if needed
                            }}
                            disabled={isPaid}
                        >
                            {isPaid ? 'Paid' : 'Pay'}
                        </button>
                    </div>
                    <img src="/QR_code.png" alt="" />

                    <p style={{ fontSize: '0.9em', color: '#666' }}>Wallet Never Expires, redeem anytime.</p>
                </div>
            )}
        </div>
    );

};

export default Customer;

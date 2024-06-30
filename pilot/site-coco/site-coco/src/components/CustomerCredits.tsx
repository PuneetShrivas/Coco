"use client";
import { useState, useEffect } from 'react';
import { Button, Center, Box, VStack, useToast } from '@chakra-ui/react';

const CustomerCredits = ({ initialPrice, number, vendorNumber }: { initialPrice: number, number: number, vendorNumber: string }) => {
    const [price, setPrice] = useState(initialPrice.toString());
    const [totalValue, setTotalValue] = useState(0);
    const [cashback, setCashback] = useState(0);
    const [walletBack, setWalletBack] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [showQROnly, setShowQROnly] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(0);


    const toast = useToast();

    useEffect(() => {
        calculateValues();
    }, [initialPrice]);

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
            setTotalValue(Math.ceil(priceWithAddon / 100) * 100);
            setCashback(20);
        }

        setWalletBack(totalValue - parseFloat(price) + cashback);
    };

    const handlePayClick = async () => {
        setIsPaid(true);
        setSelectedPrice(totalValue); // Update selectedPrice with totalValue
        setShowQROnly(true);

        const transactionData: any = {
            vendor_number: vendorNumber,
            phone_number: phoneNumber,
            price: parseFloat(price),
            gamified: 0,
        };

        try {
            const response = await fetch('/api/os/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData)
            });

            if (response.ok) {
                console.log('Transaction saved successfully');
                toast({
                    title: "Transaction Saved",
                    description: "Your transaction has been saved successfully!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                console.error('Error saving transaction:', response.statusText);
                // Error handling in UI
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            // Error handling in UI
        }

    };



    return (
        <div className="container mt-[5vh] bg-white h-full" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center'
        }}>

            <Center h="100%">
                <Box>
                    <Center>
                        <p className="result-line text-green-800 mx-auto"
                            style={{ margin: '5px 0', color: 'green.800', fontSize: '24px' }}>
                            Pay <span className="value text-green-800">₹{totalValue}</span>
                        </p>
                    </Center>

                    <Center>
                        <p className="result-line mx-auto w-fit"
                            style={{ margin: '5px 0', color: 'gray.700', fontSize: '18px' }}>
                            Get a bonus of <span className="value text-green-800">₹{cashback}</span>
                        </p>
                    </Center>

                    <Center>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span role="img" aria-label="gift">🎁</span>
                            <p className="result-line"
                                style={{ margin: '5px 0', fontSize: '18px', color: 'gray.700' }}>
                                and<span className="value text-green-800"> get ₹{walletBack}</span> back in wallet
                            </p>
                        </div>
                    </Center>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Phone Number"
                            className="phone-input"
                            style={{
                                padding: '10px',
                                margin: '10px 5px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                width: '200px'
                            }}
                        />
                        <button
                            onClick={handlePayClick}
                            className="pay-button"
                            style={{
                                padding: '10px 15px',
                                backgroundColor: isPaid ? '#ccc' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginLeft: '10px',
                            }}
                            disabled={isPaid}
                        >
                            {isPaid ? 'Paid' : 'Pay'}
                        </button>
                    </div>
                    <Center>
                        <img src="/QR_code.png" alt="" />
                    </Center>
                    <p className="subtext" style={{ fontSize: '0.9em', color: '#666' }}>(Wallet Never Expires, redeem anytime.)</p>

                </Box>
            </Center>

            {showQROnly && (
                <>
                    <div className="qr-only">
                        <p className="price-display" style={{ color: 'green.800', fontSize: '24px' }}>₹{price}</p>
                        <img src="/QR_code.png"></img>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Phone Number"
                            className="phone-input"
                            style={{
                                padding: '10px',
                                margin: '10px 5px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                width: '200px'
                            }}
                        />
                        <button
                            onClick={handlePayClick}
                            className="pay-button"
                            style={{
                                padding: '10px 15px',
                                backgroundColor: isPaid ? '#ccc' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginLeft: '10px',
                            }}
                            disabled={isPaid}
                        >
                            {isPaid ? 'Paid' : 'Pay'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomerCredits;

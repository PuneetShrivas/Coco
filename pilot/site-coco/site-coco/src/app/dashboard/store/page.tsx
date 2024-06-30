"use client";
import { useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Box,
    Center,
    useToast
} from '@chakra-ui/react';


const Customer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [price, setPrice] = useState('');
    const [totalValue, setTotalValue] = useState(0);
    const [cashback, setCashback] = useState(0);
    const [gamified, setGamified] = useState(1);
    const [walletBack, setWalletBack] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('');
    const toast = useToast();

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

    const [showModal, setShowModal] = useState(false);
    const [showQROnly, setShowQROnly] = useState(false);
    
    const handleInitPayClick = () => {
        onOpen(); // Use onOpen to open the modal
        
    };
    const handlePayClick = async () => {
        calculateValues();
        setIsPaid(true);

        // Transaction Data to Save
        const transactionData: any = { // Use `any` type for now due to lack of precise type definition from API
            vendor_number: '0',
            phone_number: phoneNumber, 
            price: parseFloat(price), // Original price
            gamified: gamified, // 1 for gamified (increased price), 0 for original
        };

        try {
            // Save Transaction (API Call)
            const response = await fetch('/api/os/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData)
            });

            if (response.ok) {
                console.log('Transaction saved successfully');
                // Additional actions after successful save (e.g., update UI)
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

    const handleSkipClick = () => {
        setGamified(0);
        onClose(); // Use onClose to close the modal
        setShowQROnly(true);
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
            {!showQROnly && (<>
            <h2 className="title" style={{ marginBottom: '20px', color: 'green.800', fontSize: '24px' }}>Get more every time!</h2>

            <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Enter Price"
                className="price-input"
                style={{
                    padding: '10px',
                    margin: '10px 0',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    width: '200px' 
                }}
                onBlur={calculateValues}
            />

            <Button onClick={handleInitPayClick} className="pay-button">
                Pay
            </Button>
            </>)}

            {/* {showQROnly && (
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
            )} */}

                <Modal isOpen={isOpen} onClose={onClose}>   
                <ModalOverlay />
                <ModalContent className='mx-[5vw]'>
                    <ModalHeader>Payment Offer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className="result">
                    <Center h="100%">
                        <Box>
                        <Center> {/* Center the first line */}
                                <p className="result-line text-green-800 mx-auto" 
                                    style={{ margin: '5px 0', color: 'green.800', fontSize: '24px' }}>
                                    Pay <span className="value text-green-800">₹{totalValue}</span>
                                </p>
                            </Center>total

                            <Center> {/* Center the second line */}
                                <p className="result-line mx-auto w-fit" 
                                    style={{ margin: '5px 0', color: 'gray.700', fontSize: '18px' }}>
                                    Get a bonus of <span className="value text-green-800">₹{cashback}</span>
                                </p>
                            </Center>

                            <Center> {/* Center the third line (with the emoji) */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span role="img" aria-label="gift">🎁</span> 
                                    <p className="result-line" 
                                        style={{ margin: '5px 0', fontSize: '18px', color: 'gray.700' }}>
                                        and<span className="value text-green-800"> get ₹{totalValue - parseFloat(price) + cashback}</span> back in wallet
                                    </p>
                                </div>
                            </Center>

                        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                        </div> */}
                        <Center>
                        {/* <img src="/QR_code.png" alt="" /> */}
                        </Center>
                        <p className="subtext" style={{ fontSize: '0.9em', color: '#666' }}>(Wallet Never Expires, redeem anytime.)</p>
                        </Box>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSkipClick}> Else skip and pay ₹ {price}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );

};

export default Customer;

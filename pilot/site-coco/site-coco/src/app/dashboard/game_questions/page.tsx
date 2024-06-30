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
    Center,
    Box,
    useToast
} from '@chakra-ui/react';

const Customer = () => {
    const [price, setPrice] = useState('');
    const [totalValue, setTotalValue] = useState(0);
    const [predictedValue, setPredictedValue] = useState(0); 
    const [isYesSelected, setIsYesSelected] = useState(false);
    const [isNoSelected, setIsNoSelected] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();
    const handlePayClick = () => {
        setTotalValue(Math.ceil(parseFloat(price) * 1.5 / 10) * 10);
        setPredictedValue(Math.round(parseFloat(price) * 0.5 / 10) * 10); 
        onOpen(); 
    };
    const handleSkipClick = () => {
        onClose();
        setIsYesSelected(false);
        setIsNoSelected(false);
    };

    const handleYesClick = () => {
        setIsYesSelected(true);
        setIsNoSelected(false);
    };
    

    const handleNoClick = () => {
        setIsNoSelected(true);
        setIsYesSelected(false);
    };

    const [showQRCode, setShowQRCode] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [isPaid, setIsPaid] = useState(false); 

    const handlePayQRClick = async () => {
        setIsPaid(true)
        await saveTransaction(isYesSelected ? 2 : 1);
    };

    const handlePayNormal = async () => {
        onClose();
        setSelectedPrice(parseFloat(price));
        setShowQRCode(true);
        await saveTransaction(0);
    };

    const saveTransaction = async (gamified: number) => {
        const transactionData = {
            vendor_number: '0',
            phone_number: phoneNumber,
            price: parseFloat(price), // Original price
            gamified:gamified,
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
                // Show error toast
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            // Show error toast
        }
    };


    const handlePayExtra = async () => {
        onClose();
        setSelectedPrice(totalValue);
        setShowQRCode(true);
        await saveTransaction(2);
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

           {!showQRCode && (
            <>
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
            />
            <Button onClick={handlePayClick} className="pay-button">
                Pay
            </Button>

            </>)}

            
            {showQRCode && (
                <>
                <div className="qr-only">
                    <p className="price-display" style={{ color: 'green.800', fontSize: '24px' }}>₹{price}</p>
                    <img src="/QR_code.png" alt="" />
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
                    onClick={handlePayQRClick} 
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

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent className="mx-[5vw]">
                    <ModalHeader>Predict and Win!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className="result">
                        <Center h="100%">
                            <Box>
                            <Center>
                                <p className="text-gray-700 text-[18px]" style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>Total Price: ₹{price}</p>
                                </Center>
                            <Center>
                                <p className="text-gray-700 text-[18px]"> 🎁 Predict and <span className="text-green-800 text-[24px]" >win back: ₹{predictedValue}</span></p>
                                </Center>
                                {/* <Center>
                                <p className="text-gray-700 text-[18px]"> Effective Price : <span className="text-green-800 text-[18px]" >₹{parseFloat(price)>25? parseFloat(price)+10-predictedValue:parseFloat(price)+5-predictedValue}</span></p>
                                </Center> */}
                                {/* Your pre-written question goes here */}
                                <p className="mt-[2vh] text-[20px]">Will RCB qualify for playoffs in IPL 2025</p>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                    <Button 
                                        colorScheme={isYesSelected ? 'green' : 'gray'} 
                                        onClick={handleYesClick}
                                        rounded="full"
                                        color={isYesSelected ? 'white' : 'gray'} 

                                    >
                                        Yes
                                    </Button>
                                    <Button 
                                        colorScheme={isNoSelected ? 'green' : 'gray'} 
                                        onClick={handleNoClick}
                                        rounded="full"
                                        color={isNoSelected ? 'white' : 'gray'} 
                                    >
                                        No
                                    </Button>
                                </div>

                                {/* {(isYesSelected || isNoSelected) && (
                                    <div style={{ marginTop: '20px' }}>
                                        <QRCode value={`Ticket: ${isYesSelected ? totalValue - predictedValue : totalValue}, Phone: ${phoneNumber}`} />
                                        <p className="text-green-800 text-[24px]">₹{isYesSelected ? totalValue - predictedValue : totalValue}</p>
                                    </div>
                                )} */}
                            </Box>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="gray" onClick={handlePayNormal} mr={3}>
                            Skip and Pay ₹{price}
                        </Button>
                        <Button color="green" onClick={handlePayExtra}>Predict and Pay ₹{parseFloat(price)>25? parseFloat(price)+10 :parseFloat(price)+5 }</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Customer;


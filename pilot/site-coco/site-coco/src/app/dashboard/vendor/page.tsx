"use client";
import { useState, useEffect } from 'react';
import {
    Input,
    Button,
    Select,
    FormControl,
    FormLabel,
    Center,
    Box,
    VStack,
    useToast,
    Spinner
} from '@chakra-ui/react';

const VendorInterface = () => {
    const [vendorNumber, setVendorNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [price, setPrice] = useState('');
    const [number, setNumber] = useState('');
    const [gameType, setGameType] = useState('credits');
    const [isTransactionComplete, setIsTransactionComplete] = useState(false);
    const [pollingTimeout, setPollingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
    const toast = useToast();

    const handleSubmit = async () => {
        setIsLoading(true);
        const gameValue = gameType === 'credits' ? 0 : 1;
        const data = {
            vendor_number: parseInt(vendorNumber),
            price: parseInt(price),
            game: gameValue,
            number: parseInt(number)
        };

        try {
            const response = await fetch('/api/os/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Success:', await response.json());

                checkTransactionStatus(); // Start polling after successful submission
            } else {
                console.error('Error:', response.statusText);
                // Optionally: Handle error
            }
        } catch (error) {
            console.error('Error:', error);
            // Optionally: Handle error
        }
    };

    const checkTransactionStatus = async () => {
        let attempts = 0;
        const maxAttempts = 24; // 2 minutes (120 seconds) / 5 seconds per attempt
    
        const pollForTransaction = async () => {
            if (attempts >= maxAttempts) {
                if (pollingInterval) { // Check if pollingInterval is not null
                    clearInterval(pollingInterval); // Clear the interval if it exists
                }
                setIsTransactionComplete(false);
                toast({
                    title: "Transaction Pending",
                    description: "Your transaction is still pending. Please try again later.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
                // Refresh the page after a delay
                const timeoutId = setTimeout(() => {
                    window.location.reload(); 
                }, 5000);
    
                setPollingTimeout(timeoutId); // Store the timeout ID for later cleanup
                return;
            }
    
            try {
                const response = await fetch(`/api/os/transactions?vendor_number=0&price=${price}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        if (pollingInterval) {
                            clearInterval(pollingInterval);
                        }
                        setIsTransactionComplete(true);
                        // ... (Toast notification remains the same)
                    }
                } else {
                    console.error('Error checking transaction status:', response.statusText);
                }
            } catch (error) {
                console.error('Error checking transaction status:', error);
            } finally {
                attempts++;
            }
        };
    
        const intervalId = setInterval(pollForTransaction, 5000); // Store interval ID
        setPollingInterval(intervalId);
    };

    useEffect(() => {
        return () => {
            if (pollingTimeout) {
                clearTimeout(pollingTimeout);
            }
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingTimeout, pollingInterval]);


    return (
        <div className="bg-white h-full">
        <Center h="100vh"> {/* Center the content vertically */}
            <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel htmlFor="vendorNumber">Vendor Number</FormLabel>
                        <Input 
                            id="vendorNumber" 
                            value={vendorNumber} 
                            onChange={(e) => setVendorNumber(e.target.value)} 
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="price">Price</FormLabel>
                        <Input 
                            id="price" 
                            type="number" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="number">Number</FormLabel>
                        <Input 
                            id="number" 
                            type="number" 
                            value={number} 
                            onChange={(e) => setNumber(e.target.value)} 
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="gameType">Game Type</FormLabel>
                        <Select id="gameType" value={gameType} onChange={(e) => setGameType(e.target.value)}>
                            <option value="credits">Credits</option>
                            <option value="prediction">Prediction</option>
                        </Select>
                    </FormControl>

                    <Button colorScheme="teal" onClick={handleSubmit}>Submit</Button>
                    {/* Spinner and Waiting Message */}
                    {isLoading && (
                            <Box mt={4} textAlign="center">
                                <Spinner size="md" color="teal.500" />
                                <span className="mt-2">Waiting for transaction to complete...</span>
                            </Box>
                        )}
                </VStack>
            </Box>
        </Center>
        </div>
    );
};

export default VendorInterface;

"use client";
import { useParams } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import { List, ListItem, ListIcon, Center, Spinner, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from 'lucide-react';

export default function VendorTransactions() {
    const params = useParams();
    const vendorNumber = params.number; // Get vendor_number from the URL

    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await fetch(`/api/os/transactions?vendor_number=${vendorNumber}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data);
                    console.log(data)
                } else {
                    console.error("Error fetching transactions:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTransactions();
    }, [vendorNumber]); 

    if (isLoading) {
        return (
            <div className="h-[100vh] bg-white mt-[10vh]">
            <Center h="100vh">
                <Spinner size="xl" />
                <Text ml={4}>Loading transactions...</Text>
            </Center>
            </div>
        );
    }

    return (
        <div className="h-[100vh] bg-white mt-[10vh]">
            <h2 className="mt-[5vh] mx-2"style={{color: 'green.800', fontSize: '24px',textAlign: 'center' }}>Transactions for Vendor {vendorNumber}</h2>
            <Center>
            <List className="mt-[2vh] mx-2" spacing={3}>
                {transactions.map((transaction, index) => (
                    <ListItem key={index} display="flex" alignItems="center">
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <div>
                            <span>Price: ₹{transaction._source.price}</span> | 
                            <span>Game: {transaction._source.gamified === 0 ? 'Credits' : 'Prediction'}</span> |
                            <span>Number: {transaction._source.phone_number}</span>
                        </div>
                    </ListItem>
                ))}
            </List>
            </Center>
        </div>
    );
}


"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Center, Spinner, Text } from '@chakra-ui/react'; // Import Chakra UI components
import CustomerCredits from '@/components/CustomerCredits'; // Import your Credits component
// import CustomerPrediction from '@/components/CustomerPrediction'; // Import your Prediction component

const CustomerVendorPage  = () =>  {
  const router = useRouter();
  const params = useParams();
  const vendorNumber = params.vendor_number as string;

  const [isLoading, setIsLoading] = useState(true);
  const [priceData, setPriceData] = useState<any>(null); // Store fetched price data

  useEffect(() => {
    async function fetchPriceData() {
      try {
        const response = await fetch(`/api/os/price?vendor_number=${vendorNumber}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setPriceData(data[0]._source); // Take the first matching document (assuming only one price per vendor)
          } else {
            console.error("No price data found for this vendor.");
            // Optionally handle the case where no data is found
          }
        } else {
          console.error("Error fetching price data:", response.statusText);
          // Optionally handle the error
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
        // Optionally handle the error
      } finally {
        setIsLoading(false);
      }
    }
    fetchPriceData();
  }, [vendorNumber]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
        <Text ml={4}>Loading...</Text>
      </Center>
    );
  }

  if (!priceData) {
    return (
      <Center h="100vh">
        <Text>No price data found for this vendor.</Text>
      </Center>
    );
  }

  return (
    <div className="mt-[5vh] bg-white h-full" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
    }}>
        {priceData.game === 0 ? (
            <CustomerCredits initialPrice={priceData.price} number={priceData.number} vendorNumber={vendorNumber} />
        ) : (
          <div></div>
            // <CustomerPrediction initialPrice={priceData.price} number={priceData.number} vendorNumber={vendorNumber} />
        )}
    </div>
  );
};
export default CustomerVendorPage;
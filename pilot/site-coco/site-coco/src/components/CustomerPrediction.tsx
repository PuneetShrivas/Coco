"use client";
import { useState, useEffect } from 'react';
import { Button, Center, Box, VStack, useToast } from '@chakra-ui/react';

const CustomerPrediction = ({ initialPrice, number, vendorNumber }: { initialPrice: number, number: number, vendorNumber: string }) => {
  const [price, setPrice] = useState(initialPrice.toString());
  const [totalValue, setTotalValue] = useState(0);
  const [predictedValue, setPredictedValue] = useState(0);
  const [isYesSelected, setIsYesSelected] = useState(false);
  const [isNoSelected, setIsNoSelected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [isPaid, setIsPaid] = useState(false);

  const toast = useToast();

  useEffect(() => {
    calculateValues();
  }, [initialPrice]);

  const calculateValues = () => {
    const priceWithAddon = parseFloat(price) * 1.5;

    if (priceWithAddon < 50) {
      setTotalValue(50);
      setPredictedValue(5);
    } else if (priceWithAddon <= 100) {
      setTotalValue(100);
      setPredictedValue(10);
    } else if (priceWithAddon <= 150) {
      setTotalValue(150);
      setPredictedValue(15);
    } else {
      setTotalValue(Math.ceil(priceWithAddon / 100) * 100);
      setPredictedValue(20);
    }
  };

  const handlePayQRClick = async () => {
    setIsPaid(true);
    await saveTransaction(isYesSelected ? 2 : 1);
  };

  const saveTransaction = async (gamified: number) => {
    const transactionData = {
        vendor_number: vendorNumber,
        phone_number: phoneNumber,
        price: selectedPrice,
        gamified: gamified
    };

    try {
      const response = await fetch('/api/os/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
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

  const handleYesClick = () => {
    setIsYesSelected(true);
    setIsNoSelected(false);
    setSelectedPrice(totalValue - predictedValue);
    setShowQRCode(true);
  };

  const handleNoClick = () => {
    setIsNoSelected(true);
    setIsYesSelected(false);
    setSelectedPrice(totalValue);
    setShowQRCode(true);
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
        <h2 className="title" style={{ marginBottom: '20px', color: 'green.800', fontSize: '24px' }}>Get more every time!</h2>

        {!showQRCode && (
          <>
            <Center>
              <p className="text-gray-700 text-[18px]" style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                Total Price: ₹{price}
              </p>
            </Center>
            <Center>
              <p className="text-gray-700 text-[18px]">
                🎁 Predict and <span className="text-green-800 text-[24px]">win back: ₹{predictedValue}</span>
              </p>
            </Center>
            <Center>
              <p className="text-gray-700 text-[18px]">
                Effective Price : <span className="text-green-800 text-[18px]">
                  ₹{parseFloat(price) > 25 ? parseFloat(price) + 10 - predictedValue : parseFloat(price) + 5 - predictedValue}
                </span>
              </p>
            </Center>
            {/* Your pre-written question goes here */}
            <p className="mt-[2vh] text-[20px]">
              Will Virat Kohli announce his retirement after the world cup is over?
            </p>

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
          </>
        )}

        {showQRCode && (
          <div className="qr-only">
            <p className="price-display" style={{ color: 'green.800', fontSize: '24px' }}>₹{selectedPrice}</p>
            <img src="/QR_code.png" alt="" />
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
          </div>
        )}
    </div>
  );
};

export default CustomerPrediction;

'use client';

import { useRouter } from 'next/navigation';
import { Button, Box, IconButton, Flex, Image, Text, Divider, Icon } from '@chakra-ui/react'; // Or your UI library of choice
import { ArrowLeft, Calendar, ChevronLeftIcon, ChevronRightIcon, ImagePlus } from 'lucide-react';
import Link from 'next/link';
import { Lexend, Manrope } from 'next/font/google';
import { useState, useEffect } from 'react';
const lexendFont= Lexend({ weight: '700', subsets: ['latin'] })
const manropeFont= Manrope({ weight: '400', subsets: ['latin'] })


export default function OOTD() {
  const router = useRouter();
  const [todayDate, setTodayDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate); // Start with current date selected
  const [ootdImage, setOOTDImage] = useState<string | null>(null);
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentWeekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - currentDate.getDay() + i);
    return date;
  });
  const calculateWeekDates = (date: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - date.getDay() + i);
      return newDate;
    });
  };
  const moveWeekBack = () => {
    const newDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
    setCurrentDate(newDate);
    // Now use the updated currentDate to calculate the new week's dates
    setSelectedDate(calculateWeekDates(newDate)[6]);
  };

  const moveWeekForward = () => {
    const newDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
    setCurrentDate(newDate);
    // Now use the updated currentDate to calculate the new week's dates
    setSelectedDate(calculateWeekDates(newDate)[0]); 
  };  

  useEffect(() => {
    // Logic to fetch OOTD image based on selectedDate
    // ... e.g., fetch from an API or local storage
    // Update the ootdImage state based on the fetched image
  }, [selectedDate]);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };


  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='bg-white min-h-screen antialias flex flex-col '>
      <Box  className="mt-[8vh]">
        <Flex px="4vw" flexDir="row" justifyContent="space-between" className="align-middle">
          <Flex flexDir="row" className="items-baseline">
            <IconButton
              aria-label="Back"
              icon={<ChevronLeftIcon />}
              onClick={handleGoBack}
              mt={4}
              size="md"
              variant="outline"
              colorScheme="blackAlpha" // Use blackAlpha for a softer black
              borderRadius="full"  // Makes the button a circle
              bg="white"
              _hover={{ bg: 'gray.100' }} // Slight hover effect
            />
            <Text 
            onClick={() => setSelectedDate(currentDate)} // Reset selectedDate on click
            cursor="pointer" // Add cursor for better user experience
            className={lexendFont.className}
            px={4}
            fontSize="29px"
            lineHeight="44px"
            fontWeight="700"
            color="#7E43ABFF"
          >
            {formatDate(todayDate)}
          </Text> 
          </Flex>
          <Link href="/dashboard/ootd/calendar">
          <IconButton
              aria-label="Back"
              icon={<Calendar />}
              mt={4}
              size="lg"
              variant="ghost"
              colorScheme="blackAlpha" // Use blackAlpha for a softer black
              borderRadius="full"  // Makes the button a circle
              bg="white"
              _hover={{ bg: 'gray.100' }} // Slight hover effect
            />
            </Link>
        </Flex>
        {/* Horizontal Dates */}
        <Flex px="2vw" justifyContent="space-around" alignItems="center" mt={4}>
          <IconButton
            aria-label="Previous Week"
            icon={<ChevronLeftIcon />}
            onClick={moveWeekBack}
            size="md"
          />

          {currentWeekDates.map((date) => (
            <Box 
            key={date.toDateString()} 
              onClick={() => setSelectedDate(date)} 
              className={date.toDateString() === selectedDate.toDateString() ? "border-b-2 border-[#6b8135]" : ""}
              bg={date.toDateString() === selectedDate.toDateString() ? "#d2ec8f" : "transparent"} // Highlight SELECTED day
              p={2}
              borderRadius="md"
            >
              <Text className={manropeFont.className} textAlign="center">{weekDays[date.getDay()]}</Text>
              <Text textAlign="center" fontWeight={date.toDateString() === selectedDate.toDateString() ? "bold" : "normal"}>
                {date.getDate()}
              </Text>
            </Box>
          ))}

        <IconButton aria-label="Next Week" icon={<ChevronRightIcon />} onClick={moveWeekForward} size="md" />
        </Flex>
        <Divider />
        {/* Selected Date Display */}
        <div className='mx-[5vw]'>
        <Text 
          mt={6} // Add some margin above the date
          fontSize="md" // Smaller font size
          className={lexendFont.className}
          fontWeight="500" // Slightly less bold
          color="#7E43ABFF"
        >
          {formatDate(selectedDate)} {/* Full date format here */}
        </Text>
        {/* OOTD Image */}
        {ootdImage ? (
          <Image src={ootdImage} alt="OOTD" mt={4} maxH="400px" mx="auto" />
        ) : (
          <Flex 
            direction="column" 
            alignItems="center" 
            justifyContent="center" 
            bg="gray.200" 
            h="400px" // Adjust height as needed
            mt={4}
          >
            <Text textAlign="center">Upload your fit check for today</Text>
            <Icon as={ImagePlus} boxSize={12} mt={4} color="gray.500" /> {/* Add image icon */}
          </Flex>
        )}
</div>
      </Box>
      
    </div>
  );
}

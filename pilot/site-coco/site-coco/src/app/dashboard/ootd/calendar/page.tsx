'use client';
import { useState, useEffect } from 'react';
import { Box, Flex, Text, IconButton, Grid, GridItem, Button, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, CalendarDaysIcon, PlusCircleIcon, UsersIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Lexend, Manrope } from 'next/font/google';
import { cn } from '@/lib/utils';
import mixpanel from 'mixpanel-browser';
const lexendFont= Lexend({ weight: '700', subsets: ['latin'] })
const manropeFont= Manrope({ weight: '200', subsets: ['latin'] })
export default function Calendar() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentDate, setCurrentDate] = useState(new Date());
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

  const moveToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const moveToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date); // Set selectedDate when a date is clicked
    onOpen();
  };
  const [ipAddress, setIpAddress] = useState<string | null>(null); 

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    // Only fetch the IP address if it's not already set
    if (!ipAddress) {
      fetchIpAddress();
    }

    // Initialize Mixpanel (moved outside the if condition)
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_ID || "", {
      debug: true,
      track_pageview: true,
      persistence: "localStorage",
    });

    // Track the event after the IP address is fetched and Mixpanel is initialized
    if (ipAddress) {
      mixpanel.track("outfit_calendar", { $ip: ipAddress });
    }
  }, [ipAddress]);
  const getMonthDays = (date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
    // Create an array of empty elements representing days before the 1st
    const emptyDays = Array.from({ length: firstDayOfMonth }, () => null);

    
  

    // Create an array of days in the month, starting from 1
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Combine the empty days and the days of the month
    return [...emptyDays, ...days];
  };
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  // Calculate dates for the next month
  const nextMonthDate = new Date(currentDate);
  nextMonthDate.setMonth(currentDate.getMonth() + 1);
  const nextMonthDays = getMonthDays(nextMonthDate);

  return (
    <div className='bg-white min-h-screen antialiased flex flex-col'>
      <Flex flexDir="row" mb={6} borderBottom="1px solid gray">
      <Box px="5vw" className="mt-[10vh]  mb-[0.6vh] flex justify-between items-center">
        {/* Back Button */}
        <IconButton aria-label="Back" icon={<ChevronLeftIcon />} onClick={handleGoBack} size="lg" variant="outline" colorScheme="blackAlpha" borderRadius="full" bg="white" _hover={{ bg: 'gray.100' }} />
      </Box>
      <Text className={cn(lexendFont.className,"mt-[11vh] ml-[13vw]")} fontSize="19px" >Calendar</Text>
        {/* Month Navigation Buttons (Fixed Position) */}
        <Flex flexDir="row" mt={6} justify="flex-end" position="fixed" top={16} right="5vw" zIndex={1}>
          <IconButton aria-label="Previous Month" icon={<ChevronUpIcon />} onClick={moveToPreviousMonth} size="md" mr={2} />
          <IconButton aria-label="Next Month" icon={<ChevronDownIcon />} onClick={moveToNextMonth} size="md" />
        </Flex>
      </Flex>
      

      {/* Calendar */}
      <Box mt={2} px="5vw">
        {/* Weekday Labels */}
        <Grid templateColumns="repeat(7, 1fr)" mb={2} gap={2}>
          {weekdays.map((day) => (
            <GridItem key={day} fontWeight="bold" fontSize="14px" textAlign="center" textColor="#565D6D" className={manropeFont.className}>{day}</GridItem>
          ))}
        </Grid>

        {/* First and Second Month (with date buttons) */}
        {[currentDate, nextMonthDate].map((monthDate, monthIndex) => (
          <Flex key={monthIndex} flexDir="column" mt={monthIndex === 0 ? 5 : 4}>
            <Text fontSize="18px" textAlign="center" fontWeight="bold" textColor="#171A1F" className={lexendFont.className}>
              {months[monthDate.getMonth()]} {monthDate.getFullYear()}
            </Text>
            <Grid templateColumns="repeat(7, 1fr)" gap={2}>
              {getMonthDays(monthDate).map((day, index) => (
                <GridItem 
                  key={index}
                  textAlign="center"
                  fontWeight={day === new Date().getDate() && monthDate.getMonth() === new Date().getMonth() ? 'bold' : 'normal'}
                  bg={day === new Date().getDate() && monthDate.getMonth() === new Date().getMonth() ? 'purple.100' : 'transparent'}
                  p={2}
                  borderRadius="md"
                  fontSize="17px"
                  className={manropeFont.className}
                  onClick={() => day && handleDateClick(new Date(monthDate.getFullYear(), monthDate.getMonth(), day))}
                  cursor={day ? "pointer" : "default"} // Add cursor for clickability
                >
                  {day || ''}
                </GridItem>
              ))}
            </Grid>
          </Flex>
        ))}   
      </Box>
      {/* Blur Overlay and Buttons */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.700" backdropFilter='blur(10px) '/> {/* Darker overlay */}
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontFamily="Lexend">{selectedDate && formatDate(selectedDate)}</Text> {/* Display selected date */}
              <ModalCloseButton as={IconButton} icon={<XIcon />} /> {/* Close (X) button */}
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Flex direction="column" gap={4} mb={4}>
              <Button className='text-white py-4' height="8vh" bgColor="#7E43AB" leftIcon={<PlusCircleIcon color='white' />} ><span className='text-white'>Upload OOTD Photo</span></Button>
              <Button className='text-black py-4' height="8vh" bgColor="#C4EB5F" leftIcon={<CalendarDaysIcon />} >Create New Event</Button>
              <Button className='text-black py-4' height="8vh" bgColor="#FEF0F0" leftIcon={<UsersIcon />} >Add People to Meet</Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

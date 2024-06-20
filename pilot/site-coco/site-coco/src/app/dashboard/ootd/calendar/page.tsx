"use client"
import { useState, useEffect } from 'react';
import { Box, Flex, Text, IconButton, Grid, GridItem, Button, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Spinner, ModalOverlay } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, CalendarDaysIcon, PlusCircleIcon, UsersIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Lexend, Manrope } from 'next/font/google';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PiPencilSimpleLineLight } from "react-icons/pi";
import mixpanel from 'mixpanel-browser';

const lexendFont = Lexend({ weight: '700', subsets: ['latin'] });
const manropeFont = Manrope({ weight: '200', subsets: ['latin'] });

export default function Calendar() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = JSON.parse(localStorage.getItem("user") ?? "");
  const dbUser = JSON.parse(localStorage.getItem("dbUser") ?? "");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [eventName, seteventName] = useState(false);
  const [clickedDateHasEvent, setclickedDateHasEvent] = useState(false);
  const [peopleToMeet, setpeopleToMeet] = useState(false);
  const [events, setEvents] = useState<string[]>([]); // Array to store dates with events

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

  const handleDateClick = async (date: Date, hasEvent: boolean) => {

    setSelectedDate(date); // Set selectedDate when a date is clicked
    if (hasEvent) {
      try {
        setclickedDateHasEvent(true);
        setIsLoading(true);
        const response = await fetch(`/api/user/get_ootd_image?date=${date.toISOString()}&userId=${user?.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.images) {
            setImageSrc(data.images[0].url);
            seteventName(data.name);
            setpeopleToMeet(data.people);
          } else {
            setImageSrc("");
          }
        } else {
          console.error('Failed to fetch OOTD image:', await response.json());
          setImageSrc("");
        }
      } catch (error) {
        console.error('Error fetching OOTD image:', error);
        setImageSrc("");
      } finally {
        setIsLoading(false);
        onOpen(); // Open modal after data fetch attempt
      }
    } else {
      setclickedDateHasEvent(false);
      onOpen();
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Month is 1-based in the API
        const response = await fetch(`/api/user/get_events/${year}/${month}`);
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

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
        <Text className={cn(lexendFont.className, "mt-[11vh] ml-[13vw]")} fontSize="19px">Calendar</Text>
        {/* Month Navigation Buttons (Fixed Position) */}
        <Flex flexDir="row" mt={6} justify="flex-end" position="fixed" top={16} right="5vw" zIndex={1}>
          <IconButton aria-label="Previous Month" icon={<ChevronUpIcon />} onClick={moveToPreviousMonth} size="md" mr={2} />
          <IconButton aria-label="Next Month" icon={<ChevronDownIcon />} onClick={moveToNextMonth} size="md" />
        </Flex>
      </Flex>
      {isLoading && (
        <div className="absolute inset-0 flex bg-[#dedede0f] backdrop-blur justify-center z-50 rounded-lg">
          <Spinner className='mt-[30vh]' size='xl' color='purple.500' />
        </div>
      )}
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
              {getMonthDays(monthDate).map((day, index) => {
                const isToday = day === new Date().getDate() && monthDate.getMonth() === new Date().getMonth();
                const hasEvent = events.includes(`${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
                const backgroundColor = (isToday ? 'purple.100' : (hasEvent ? 'gray.200' : 'transparent'));
                const borderColor = hasEvent ? 'gray.500' : 'transparent';

                return (
                  <GridItem
                    key={index}
                    textAlign="center"
                    fontWeight={isToday ? 'bold' : 'normal'}
                    bg={backgroundColor}
                    p={2}
                    borderRadius="md"
                    fontSize="17px"
                    className={manropeFont.className}
                    onClick={() => day && handleDateClick(new Date(monthDate.getFullYear(), monthDate.getMonth(), day), hasEvent)}
                    cursor={day ? "pointer" : "default"}
                    borderWidth={hasEvent ? '1px' : '0'} // Ensure border width is applied
                    borderStyle="solid" // Ensure border style is solid
                    borderColor={borderColor} // Apply border color
                  >
                    {day || ''}
                  </GridItem>
                );
              })}

            </Grid>
          </Flex>
        ))}
      </Box>

      {/* Blur Overlay and Buttons */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" /> {/* Darker overlay */}
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontFamily="Lexend">{selectedDate && formatDate(selectedDate)}</Text> {/* Display selected date */}
              <PiPencilSimpleLineLight className="ml-[6.4vw] mr-[15vw] size-5" strokeWidth={2} color="#171A1FFF" 
          onClick={() => { router.push(`/dashboard/ootd/add_event?date=${encodeURIComponent(selectedDate.toISOString())}`); setIsLoading(true); }}
           />
              <ModalCloseButton as={IconButton} icon={<XIcon />} /> {/* Close (X) button */}
            </Flex>
          </ModalHeader>
          <ModalBody>
            {clickedDateHasEvent ? (
              <div className="items-center align-center vertical-middle justify-center">
                <Image
                  src={imageSrc}
                  alt="OOTD"
                  className="max-h-[400px] mx-auto mt-[2vh] rounded-lg shadow-lg"
                  width={0}
                  height={0}
                  sizes="100vh"
                  style={{ width: 'auto', height: '100%' }}
                />
                <Flex flexDir="column" gap={4} mt="3vh" mx="5vw">
                  {/* Event of the Day */}
                  <Flex flexDir="row" justify="space-between" alignItems="center" gap={4}>
                    <span className={cn(manropeFont.className, "text-[16px] text-[#171A1FFF] h-[22px]")}>
                      Event of the day
                    </span>
                    <Button
                      className={cn(manropeFont.className, "text-[16px]")}
                      width="50%"
                      height="4vh"
                      bgColor="#E6F6BE"
                      color="#485F0C"
                      rounded={50}
                      verticalAlign="middle"
                    >
                      {eventName}
                    </Button>
                  </Flex>

                  {/* People to Meet */}
                  <Flex flexDir="row" justify="space-between" alignItems="center" gap={4}>
                    <span className={cn(manropeFont.className, "text-[16px] text-[#171A1FFF] h-[22px]")}>
                      People to meet
                    </span>
                    <Button
                      className={cn(manropeFont.className, "text-[16px]")}
                      width="50%"
                      height="4vh"
                      bgColor="#C6ADDA"
                      color="#7E43AB"
                      rounded={50}
                      verticalAlign="middle"
                    >
                      {peopleToMeet}
                    </Button>
                  </Flex>
                </Flex>
                <Flex flexDir="row" alignItems="center" justifyContent="center" verticalAlign="middle">
                  {/* <Button
              mt="2vh"
              variant="ghost"
              onClick={() => handleAsk(`I am wearing this outfit for a ${eventName} Event and will be meeting ${peopleToMeet}. What changes should I make to my outfit?`)}
              bgColor="white"
              borderRadius="full"
              w="fit-content"
              h="14"
              justifyContent="center"
            >
              <Icon
                as={PiChatTeardropDots}
                boxSize={14}
                color="#C4EB5F"
              />
            </Button> */}
                </Flex>
              </div>
            ) : (
              <Flex direction="column" gap={4} mb={4}>
                <Button
                  onClick={() => { router.push(`/dashboard/ootd/add_event?date=${encodeURIComponent(selectedDate.toISOString())}`); setIsLoading(true); }}
                  className='text-white py-4'
                  height="8vh" bgColor="#7E43AB"
                  leftIcon={<PlusCircleIcon color='white' />}
                >
                  <span className='text-white'>Upload OOTD Photo</span>
                </Button>
                <Button
                  onClick={() => { router.push(`/dashboard/ootd/add_event?date=${encodeURIComponent(selectedDate.toISOString())}`); setIsLoading(true); }}
                  className='text-black py-4'
                  height="8vh"
                  bgColor="#C4EB5F"
                  leftIcon={<CalendarDaysIcon />}
                >
                  Create New Event
                </Button>
                <Button
                  onClick={() => { router.push(`/dashboard/ootd/add_event?date=${encodeURIComponent(selectedDate.toISOString())}`); setIsLoading(true); }}
                  className='text-black py-4'
                  height="8vh"
                  bgColor="#FEF0F0"
                  leftIcon={<UsersIcon />}
                >
                  Add People to Meet
                </Button>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

    </div>
  );
}

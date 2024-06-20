'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Box, IconButton, Flex, Text, Divider, Icon, useDisclosure, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Spinner } from '@chakra-ui/react'; // Or your UI library of choice
import { ArrowLeft, Calendar, ChevronLeftIcon, ChevronRightIcon, ImagePlus } from 'lucide-react';
import Link from 'next/link';
import { PiChatTeardropDots, PiNavigationArrow } from "react-icons/pi";
import { PiPencilSimpleLineLight } from "react-icons/pi";
import { Lexend, Manrope } from 'next/font/google';
import { useState, useEffect } from 'react';
import mixpanel from 'mixpanel-browser';
import FileUpload from '@/components/FileUpload';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { cn } from '@/lib/utils';

const lexendFont = Lexend({ weight: '700', subsets: ['latin'] })
const manropeFont = Manrope({ weight: '400', subsets: ['latin'] })


const OOTD = () => {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user") ?? "");
  const dbUser = JSON.parse(localStorage.getItem("dbUser") ?? "");
  console.log("user", user);

  const [todayDate, setTodayDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate); // Start with current date selected
  const [ootdImage, setOOTDImage] = useState<File | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [triedFetch, setTriedFetch] = useState(false);
  const [eventName, seteventName] = useState(false);
  const [peopleToMeet, setpeopleToMeet] = useState(false);

  useEffect(() => {
    if (!triedFetch) {
      const fetchOOTDImage = async (date: Date) => {
        setIsEventLoading(true);
        try {
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
            setOOTDImage(null);
            setImageSrc("");
          }
        } catch (error) {
          console.error('Error fetching OOTD image:', error);
          setOOTDImage(null);
          setImageSrc("");
        } finally {
          setIsEventLoading(false);
          setTriedFetch(true); // Stop loading spinner
        }
      };

      if (user && selectedDate) {
        fetchOOTDImage(selectedDate);
      }
    }
  }, [selectedDate, user, triedFetch]);


  useEffect(() => {
    if (ootdImage) {
      const url = URL.createObjectURL(ootdImage);
      setImageSrc(url);
      return () => URL.revokeObjectURL(url); // Clean up when component unmounts
    } else {
      setImageSrc(""); // Clear the image source when there's no image
    }
  }, [ootdImage]);

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
      mixpanel.track("ootd_page", { $ip: ipAddress });
    }
  }, [ipAddress]);
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
  const handleImageUpload = (file: File | null) => {
    setUploadedImage(file);
    onClose();
  };
  const handleAsk = async (queryText: string) => {
      if (queryText.length >= 5) {
        setIsLoading(true);
        // Pass the image data URL and the input value as query parameters
        const response = await fetch(`/api/user/metas/${dbUser.metaId}`);
        var lat = 0
        var long = 0
        if (response.ok) {
          const meta = await response.json();
          lat = meta.lat
          long = meta.long
        }
        router.push(
          `/dashboard/outfit_review?imageDataUrl=${encodeURIComponent(imageSrc)}&queryText=${encodeURIComponent(queryText)}&metaId=${encodeURIComponent(dbUser.metaId)}&lat=${encodeURIComponent(lat)}&long=${encodeURIComponent(long)}`
        );
      }
  };
  const [isLoading, setIsLoading] = useState(false);

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
      <Box className="mt-[8vh]">
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
              onClick={() => { setSelectedDate(currentDate); setTriedFetch(false); }} // Reset selectedDate on click
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
              onClick={() => { setSelectedDate(date); setTriedFetch(false); }}
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
        {isLoading && (
          <div className="absolute inset-0 flex bg-[#dedede0f] backdrop-blur justify-center z-50 rounded-lg">
            <Spinner className='mt-[30vh]' size='xl' color='purple.500' />
          </div>
        )}
        <Divider />
        {/* Selected Date Display */}
        <div className='mx-[5vw] relative'>
        
          <Flex flexDir="row" justifyContent="space-between" width="full" mt={6}>
          <Text
            // Add some margin above the date
            fontSize="md" // Smaller font size
            className={lexendFont.className}
            fontWeight="500" // Slightly less bold
            color="#7E43ABFF"
          >
          {formatDate(selectedDate)} {/* Full date format here */}
          </Text>
          <PiPencilSimpleLineLight className="ml-[6.4vw] size-5" strokeWidth={2} color="#171A1FFF" 
          onClick={() => { router.push(`/dashboard/ootd/add_event?date=${encodeURIComponent(selectedDate.toISOString())}`); setIsLoading(true); }}
           />
          </Flex>
          {isEventLoading && (
            <div className="absolute inset-0 flex bg-[#dedede0f] backdrop-blur justify-center z-50 rounded-lg">
              <Spinner className='mt-[30vh]' size='xl' color='purple.500' />
            </div>
          )}
          {/* OOTD Image */}

          {imageSrc != "" ? (
            <div className="items-center align-center vertical-middle justify-center">
              <Image
                src={imageSrc}
                alt="OOTD"
                className="max-h-[350px] mx-auto mt-[2vh] rounded-lg shadow-lg"
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
              <Button
              mt="2vh"
              variant="ghost"
              onClick={() => handleAsk(`I am wearing this outfit for a ${eventName} Event and will be meeting ${peopleToMeet}. What changes should I make to my outfit?`)}
              bgColor="white"
              borderRadius="full"
              w="fit-content"
              h="14"
              justifyContent="center"
              // _hover={{ transform: "scale(1.1)", bg: inactiveBg }}
            >
              <Icon
                as={PiChatTeardropDots}
                boxSize={14}
                color="#C4EB5F"
              />
              {/* Get Coco's Review */}
            </Button>
            </Flex>
            </div>

          ) : (
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              bg="gray.200"
              h="400px"
              mt={4}
              onClick={() => { router.push(`/dashboard/ootd/add_event?date=${encodeURIComponent(selectedDate.toISOString())}`); setIsLoading(true); }}
            >
              <Text textAlign="center">Upload your fit check for this day</Text>
              <Icon as={ImagePlus} boxSize={12} mt={4} color="gray.500" />
            </Flex>
          )}
          <Drawer placement='bottom' onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay>
              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Upload Image</DrawerHeader>
                <DrawerBody>
                  <FileUpload onImageUpload={handleImageUpload} />
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </div>
      </Box>
      

    </div>
  );
}

export default OOTD
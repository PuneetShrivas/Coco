"use client";
import FileUpload from "@/components/FileUpload";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Spinner, useToast } from "@chakra-ui/react";
import mixpanel from 'mixpanel-browser';
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    IconButton,
    Icon,
    Text,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Button
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronLeftIcon, ImagePlus } from "lucide-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Lexend, Manrope, Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PiPencilSimpleLineLight, PiCalendarCheck } from "react-icons/pi";
import Image from 'next/image';

const manropeBold = Manrope({ weight: '800', subsets: ["latin"] });
const MonsterratFont = Montserrat({ weight: '400', subsets: ["latin"] });
const LexendFont = Lexend({ weight: '700', subsets: ['latin'] });
const manropeFont = Manrope({ weight: "400", subsets: ["latin"] });

const AddEvent = () => {
    const toast = useToast();
    const router = useRouter();
    const [eventName, setEventName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [peopleToMeet, setPeopleToMeet] = useState("");
    const [showEventNameError, setShowEventNameError] = useState(false);
    const [showPeopleToMeetError, setShowPeopleToMeetError] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const eventNameInputRef = useRef<HTMLInputElement>(null);
    const peopleToMeetInputRef = useRef<HTMLInputElement>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef<DatePicker | null>(null);
    const [imageSrc, setImageSrc] = useState<string | StaticImport>("");
    const user = JSON.parse(localStorage.getItem("user") ?? "");
    const userId = user.id; // Replace with your method of getting userId
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
          mixpanel.track("outfit_calendar_page", { $ip: ipAddress });
        }
      }, [ipAddress]);

    useEffect(() => {
        const fetchData = async () => {
          const searchParams = new URLSearchParams(window.location.search);
          const dateParam = searchParams.get('date');
          if (dateParam) {
            const parsedDate = new Date(dateParam);
            setSelectedDate(parsedDate);
          }
        };
    
        fetchData();
      }, []);

    const handleGoBack = () => {
        router.back();
    };

    const handleImageUpload = (file: File | null) => {
        setUploadedImage(file);
        onClose();
    };

    const toggleDatePicker = () => {
        setShowDatePicker((prevState) => !prevState);
        if (showDatePicker && datePickerRef.current) {
            datePickerRef.current.input?.focus();
        }
    };

    useEffect(() => {
        if (uploadedImage) {
            const url = URL.createObjectURL(uploadedImage);
            setImageSrc(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImageSrc("");
        }
    }, [uploadedImage]);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setShowDatePicker(false);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "Select Date";
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "short",
            year: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
    };

    const handleSubmit = async () => {
        if (!uploadedImage) {
            if (boxRef.current) {
                boxRef.current.classList.add("shake-animation");
            }
            setTimeout(() => {
                if (boxRef.current) {
                    boxRef.current.classList.remove("shake-animation");
                }
            }, 500);
            return;
        }

        if (!eventName) {
            setShowEventNameError(true);
            if (eventNameInputRef.current) {
                eventNameInputRef.current.classList.add("shake-animation");
            }
            setTimeout(() => {
                if (eventNameInputRef.current) {
                    eventNameInputRef.current.classList.remove("shake-animation");
                }
            }, 500);
            return;
        }

        if (!peopleToMeet) {
            setShowPeopleToMeetError(true);
            if (peopleToMeetInputRef.current) {
                peopleToMeetInputRef.current.classList.add("shake-animation");
            }
            setTimeout(() => {
                if (peopleToMeetInputRef.current) {
                    peopleToMeetInputRef.current.classList.remove("shake-animation");
                }
            }, 500);
            return;
        }

        if(uploadedImage&&eventName&&peopleToMeet){
        try {
            setIsLoading(true);
            const reader = new FileReader();
            reader.readAsDataURL(uploadedImage);
            reader.onloadend = async () => {
                const base64Image = reader.result?.toString().split(',')[1];

                const response = await fetch('/api/user/add_event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId,
                        image: base64Image,
                        date: selectedDate?.toISOString(),
                        eventName,
                        people: peopleToMeet
                    })
                });

                if (response.ok) {
                    toast({
                        title: "Event saved.",
                        description: "We've saved your event.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                    setTimeout(() => {
                        router.back();
                    }, 3000); // Navigate back after 3 seconds
                } else {
                    console.error('Failed to save event:', await response.json());
                    toast({
                        title: "Error",
                        description: "Failed to save event.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            };
        } catch (error) {
            console.error('Error submitting event:', error);
            toast({
                title: "Error",
                description: "An error occurred while submitting the event.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }
    };

    return (
        <div className="bg-white min-h-screen antialias flex flex-col">
            {isLoading && (
                    <div className="absolute inset-0 flex bg-[#dedede0f] backdrop-blur justify-center z-50">
                        <Spinner className='mt-[30vh]' size='xl' color='purple.500' />
                    </div>
                )}
            <Box className="mt-[8vh]">
                {/* Back Button */}
                <Flex px="4vw" flexDir="row" justifyContent="flex-start">
                    <IconButton
                        aria-label="Back"
                        icon={<ChevronLeftIcon />}
                        onClick={handleGoBack}
                        mt={4}
                        size="md"
                        variant="outline"
                        colorScheme="blackAlpha"
                        borderRadius="full"
                        bg="white"
                        _hover={{ bg: "gray.100" }}
                    />
                </Flex>
                
                {/* Grey Box with Content */}
                <Box
                    ref={boxRef}
                    className="mx-[5vw] mt-8 p-6 rounded-xl shadow-md"
                    style={{ backgroundColor: "#F2F2F2", height: "50vh", width: "90vw" }} alignItems="center" justifyItems="center"
                >
                    <Flex flexDir="row" className="" justify="space-between" alignItems="baseline" mb="1vh">
                        <span className={cn(LexendFont.className, "font-bold text-[18px]")}>Your Outfit Image</span>
                        <PiPencilSimpleLineLight className="ml-[6.4vw]" size={22} strokeWidth={2} color="#171A1FFF" onClick={onOpen} />
                    </Flex>

                    {imageSrc ?
                        (
                            <Image
                                src={imageSrc}
                                alt="uploadedImage"
                                className="mt-[4] max-h-[400px] mx-auto"
                                width={0}
                                height={0}
                                sizes="80vh"
                                style={{ width: 'auto', height: '80%' }} />
                        ) : (
                            <Flex
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                h="33vh" // Adjust height as needed
                                mt={4}
                                onClick={onOpen}
                            >
                                <Icon as={ImagePlus} boxSize={12} mt={4} color="gray.500" /> {/* Add image icon */}
                            </Flex>
                        )
                    }
                    <Flex flexDir="row" mx="15vw" mt="2vh" justify="space-between" alignItems="center" verticalAlign="middle">
                        <PiCalendarCheck size={22} strokeWidth={2} color="#171A1FFF" />
                        <Button
                            variant="solid"
                            width="auto"
                            height="4vh"
                            bgColor="#e6e3e3"
                            color="#171A1F"
                            rounded={50}
                            rightIcon={<ChevronDownIcon />} // Optional icon
                            onClick={toggleDatePicker} // Toggle date picker visibility
                        >
                            <span className={cn(manropeFont.className, " text-[14px]")}>
                                {formatDate(selectedDate)}
                            </span>
                        </Button>

                        {/* Conditionally Render the DatePicker */}
                        {showDatePicker && (
                            <div className="z-10">
                                <DatePicker
                                    ref={datePickerRef} // Attach the ref to the DatePicker component
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    inline // Render the datepicker inline
                                    onClickOutside={() => setShowDatePicker(false)} // Close on outside click
                                />
                            </div>
                        )}
                    </Flex>
                </Box>
                <Flex flexDir="column" gap={4} mt="3vh" mx="5vw">
                    {/* Event of the Day */}
                    <Flex flexDir="row" justify="space-between" alignItems="center" gap={4}> {/* Added gap */}
                        <span className={cn(MonsterratFont.className, "text-[16px] text-[#171A1FFF] h-[22px]")}>
                            Event of the day
                        </span>
                        <Input
                            ref={eventNameInputRef}
                            type="text"
                            value={eventName}
                            onChange={(e) => {
                                setEventName(e.target.value); // Update state on change
                                setShowEventNameError(false);
                            }}
                            className={cn(manropeBold.className, "text-[14px]")}
                            width="50%" height="4vh" // Chakra width/height for consistency
                            bgColor="#E6F6BE" color="#485F0C" rounded={50}
                            placeholder="Event Name"
                            _placeholder={{  // Add _placeholder to style the placeholder
                                color: 'gray.600',   // Darker color (adjust as needed)
                                fontSize: '12px',   // Smaller font size
                                fontWeight: 'normal', // Thinner font (remove bold)
                            }}
                        />
                    </Flex>

                    {/* People to Meet */}
                    <Flex flexDir="row" justify="space-between" alignItems="center" gap={4}>
                        <span className={cn(MonsterratFont.className, "text-[16px] text-[#171A1FFF] h-[22px]")}>
                            People to meet
                        </span>
                        <Input
                            ref={peopleToMeetInputRef}
                            type="text"
                            value={peopleToMeet}
                            onChange={(e) => {
                                setPeopleToMeet(e.target.value); // Update state on change
                                setShowPeopleToMeetError(false);
                            }}
                            className={cn(manropeBold.className, "text-[14px]")}
                            width="50%" height="4vh"
                            bgColor="#C6ADDA" color="#7E43AB" rounded={50}
                            placeholder="Friends, Date etc."
                            _placeholder={{  // Add _placeholder to style the placeholder
                                color: 'gray.600',   // Darker color (adjust as needed)
                                fontSize: '12px',   // Smaller font size
                                fontWeight: 'normal', // Thinner font (remove bold)
                            }}
                        />
                    </Flex>
                    <Flex flexDir="row" align="end" alignItems="end" justify="end">
                        <Button
                            type="submit"
                            className={cn(manropeBold.className, "text-[14px]")}
                            width="25%"
                            height="5vh"
                            bgColor="#C4EB5F"
                            color="#485F0C"
                            rounded={50}
                            mt={4}
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Flex>
                </Flex>

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
            </Box>
        </div>
    );
};

export default AddEvent;

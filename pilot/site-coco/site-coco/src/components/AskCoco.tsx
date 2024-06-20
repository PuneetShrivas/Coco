
// import { Card, CardHeader, CardBody, CardFooter, Image } from '@nextui-org/react';
import { Box, Flex, Text, Heading, Button, InputGroup, InputLeftElement, Input, IconButton, HStack, Textarea, Icon, useDisclosure, Drawer, DrawerContent, DrawerHeader, DrawerOverlay, DrawerBody, Spinner, InputRightElement } from '@chakra-ui/react'; // Import from Chakra UI
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { Upload, Sparkles, Star, Search, Camera, ChevronRight, CircleArrowRight, ArrowRight, CheckCircle, History } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Inter, Glass_Antiqua, Work_Sans, Lexend, Manrope } from 'next/font/google';
import { PiQuestionMark, PiCheckCircleLight, PiArrowRight } from "react-icons/pi";
import MaxWidthWrapper from './MaxWidthWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { CldUploadWidget } from "next-cloudinary"
import { cn } from '@/lib/utils';
import FileUpload from './FileUpload';
import React from 'react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import mixpanel from 'mixpanel-browser';
const glassAntiquaFont = Glass_Antiqua({ weight: '400', subsets: ['latin'] })
const workSansFont = Work_Sans({ weight: '600', subsets: ['latin'] })
const manrope = Manrope({ weight: '400', subsets: ["latin"] });
const LexendFont = Lexend({ weight: '400', subsets: ['latin'] })
const interFont = Inter({ subsets: ['latin'] });
const events = ["date", "wedding", "beach party", "job interview", "festival"];
const questions = [
  "Is this outfit okay for a",
  "Accessorize this for a",
  "Styling suggestions for a"
];

const DefaultImages = [
  '/image1.jpg',
  '/image2.jpg',
  '/image3.jpg',
  '/placeholder.jpg',
  '/placeholder.jpg',
  '/placeholder.jpg',
  // ... more images
];

interface DashboardProps {
  user: KindeUser | null;
  dbUser: any;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}


const AskCoco: React.FC<DashboardProps> = ({
  user,
  dbUser,
  isLoggedIn,
  onRequireLogin,
}) => {
  const router = useRouter();
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  var greeting = currentHour < 12 ? "Good Morning" : (currentHour < 17 ? "Good Afternoon" : "Good Evening");
  const randomEvent = events[Math.floor(Math.random() * events.length)];
  const boxRef = React.useRef<HTMLButtonElement>(null);
  const textboxRef = React.useRef<HTMLDivElement>(null);
  const [placeholderText, setPlaceholderText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentEvent, setCurrentEvent] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageSrc, setImageSrc] = useState<string | StaticImport>("");

  useEffect(() => {
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentEvent(randomEvent);
    setCurrentQuestion(randomQuestion);
    const fullPlaceholderText = `Ask a question about your outfit`;

    let i = 0;
    const intervalId = setInterval(() => {
      setPlaceholderText(fullPlaceholderText.slice(0, i));
      i++;
      if (i > fullPlaceholderText.length) {
        clearInterval(intervalId);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, []);


  const handleInteraction = (loggedInAction: () => void) => {
    if (!isLoggedIn) {
      setIsLoading(true);
      router.push("/sign-in")
    } else {
      loggedInAction(); // Execute the provided function if logged in
    }
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

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("dbUser", JSON.stringify(dbUser));

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
      mixpanel.track("dashboard_view", { $ip: ipAddress });
      mixpanel.identify(user?.id);
      mixpanel.people.set({
        '$name': user?.given_name?.concat(" ", user?.family_name || ""),
        '$email': user?.email,
      });
    }
  }, [ipAddress]);

  const handleFocus = () => {
    // setInputValue(placeholderText);
  };

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageUpload = (file: File | null) => {
    setUploadedImage(file);
    onClose();
  };

  const handleAsk = async (queryText: string) => {
    if (uploadedImage) {
      if (queryText.length >= 5) {
        setIsLoading(true);
        const imageDataUrl = URL.createObjectURL(uploadedImage);
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
          `/dashboard/outfit_review?imageDataUrl=${encodeURIComponent(imageDataUrl)}&queryText=${encodeURIComponent(queryText)}&metaId=${encodeURIComponent(dbUser.metaId)}&lat=${encodeURIComponent(lat)}&long=${encodeURIComponent(long)}`
        );
      } else {
        triggerShakeTextBox();
      }
    } else {
      console.log("shaking upload image box")
      triggerShakeAnimation();
    }
  };

  const triggerShakeTextBox = () => {
    if (textboxRef.current) {
      textboxRef.current.classList.add('shake-animation');
      setTimeout(() => {
        textboxRef.current?.classList.remove('shake-animation');
      }, 500);
    }
  }
  useEffect(() => {
    if (uploadedImage) {
      const url = URL.createObjectURL(uploadedImage);
      setImageSrc(url);
      return () => URL.revokeObjectURL(url); // Clean up when component unmounts
    } else {
      setImageSrc(""); // Clear the image source when there's no image
    }
  }, [uploadedImage]);

  const triggerShakeAnimation = () => {
    if (boxRef.current) {
      boxRef.current.classList.add('shake-animation');
      setTimeout(() => {
        boxRef.current?.classList.remove('shake-animation');
      }, 500);
    }
  };
  const nullfunction = async () => {
    console.log("nullfunction pressed");
  }
  const handleAccesorize = async () => {
    handleAsk("What accessories will go well with this outfit?");
  };

  const handlePressAsk = async () => {
    handleAsk(inputValue)
  }

  const handleReadyToGo = async () => {
    handleAsk("I am wearing this outdoors today. How can I improve this outfit?");
  };
  const [images, setImages] = useState<string[]>(DefaultImages);
  const [imagesLoading, setImagesLoading] = useState<boolean>(false);
  useEffect(() => {
    if (isLoggedIn) {
      setImagesLoading(true);
      const fetchImages = async () => {
        try {
          const response = await fetch('/api/user/get_images');
          if (response.ok) {
            const data = await response.json();
            let filledImages = [...data]; // Copy fetched images
            // Fill with placeholders if less than 6 images are returned
            while (filledImages.length < 6) {
              filledImages.push('/placeholder.jpg');
            }
            setImages(filledImages.slice(0, 6)); // Set exactly 6 images
          } else {
            console.error('Failed to fetch images:', await response.json());
            // Fill with placeholders on failure
            let filledImages = [...DefaultImages];
            setImages(filledImages.slice(0, 6));
          }
        } catch (error) {
          console.error('Error fetching images:', error);
          setImages(DefaultImages.slice(0, 6)); // Set default images on error
        } finally {
          setImagesLoading(false)
        }
      };

      fetchImages();
    }
  }, []);

  return (
    <MaxWidthWrapper className='' >
      <div className="mt-[9vh] h-screen">
        <div className='mx-4 mt-[1vh] mb-1'>
          <h1 className={cn(LexendFont.className, "text-[28px] mt-[14vh] font-normal text-[#190F38] dark:text-white font-display")} >
            {/* {greeting}, <span className='font-bold'>{user?.given_name}!</span> */}
            Hey, {user?.given_name}
          </h1>
          <Flex flexDir="row" justifyContent="space-between">
          <h2 className={cn('text-[20px] mt-[1vh]', LexendFont.className)}>
            Ask Coco?
          </h2>
          <History className="" onClick={()=>{router.push("/dashboard/outfit_review/history")}}/>
          </Flex>
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex bg-[#dedede0f] backdrop-blur justify-center z-50">
            <Spinner className='mt-[30vh]' size='xl' color='purple.500' />
          </div>
        )}
        <Box className="relative w-full card-shadow bg-white " px={3} borderRadius="20px" mx="auto" maxW="container.lg" >
          <Flex gap={4}>
            <Flex flexDir="row" className="h-[30vh]">

              <Button ref={boxRef} onClick={onOpen} height="30vh" bgColor="#EAECEF">
                <Box width="1/3" justifyContent="center" ml="5px" alignItems="center" display="flex" flexDir="column" rounded={"10px"} >
                  {/* Background Div for the Upload Icon */}
                  {uploadedImage ? (
                    <div className=" my-2 h-full  w-[36vw] rounded-lg items-center justify-center object-cover overflow-hidden" >
                      {/* <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" className='h-full w-full' /> */}
                      <Image src={imageSrc} alt="Uploaded" className='h-full  rounded-lg w-full overflow-hidden' style={{ objectFit: "cover" }} layout="fill" objectFit="cover" />
                    </div>
                  ) : (
                    <div className=" my-2 bg-[#EAECEF] h-full w-[30vw] rounded-[10px] flex flex-col ">
                      {/* Upload Icon */}
                      <div className='items-center justify-center flex flex-col h-full'>
                        <Camera height={25} width={25} color="gray" />
                        {/* Upload Image Text */}
                        <Text className="font-normal" mt={2} fontSize="16px" color="gray" paddingRight={5} paddingLeft={5} align="center" >
                          Upload Outfit
                        </Text>
                      </div>
                    </div>)}
                </Box>
              </Button>

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

              <Flex ml={4} flexDir="column" alignItems="left" justifyContent="space-between" width="8/12">
                <Flex flexDir="column">
                  <InputGroup ref={textboxRef} mb={1} borderRadius="10px" height="30vh" backgroundColor="#EDF2F7">
                    <InputLeftElement pointerEvents='none'>
                      <Search color='black' size={18} strokeWidth="1.1" />
                    </InputLeftElement>
                    <Textarea
                      placeholder={placeholderText}

                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={handleFocus}
                      bgColor="#D2BEE0"
                      resize="none"
                      className={manrope.className}
                      height="30vh"
                      // pt="1vh"
                      fontSize="16px"
                      lineHeight="20px"
                      overflowWrap="break-word"
                      textColor="black"
                      _placeholder={{ color: 'black' }}
                      borderRadius="10px"
                      pl="9vw">
                      {/* <span className={cn(LexendFont.className, 'text-sm')}>Suggestions</span> */}
                    </Textarea>

                    <InputLeftElement ml="0" top="24vh" width="fit-content">
                      <Flex flexDir="column" ml="2vw" gap={2} width="fit-content" alignItems="flex-start" justifyContent="flex-end" height="100%" marginBottom="1vh" >
                        <Button ml="1vw" width="fit-content" height="26px" py="4px" backgroundColor="#7E43AB" textColor="#FFFFFF" onClick={() => handleInteraction(handlePressAsk)} borderRadius="xl" >
                          <span className="px-[10px]">
                            Ask
                          </span>
                        </Button>
                        {[{ icon: PiQuestionMark, text: "Accessorize this", func: handleAccesorize }, { icon: PiCheckCircleLight, text: "Am I ready to go?", func: handleReadyToGo }].map((suggestion) => (
                          <Button
                            key={suggestion.text}
                            size="sm"
                            width="fit-content"
                            onClick={() => handleInteraction(suggestion.func)}
                            height="30px"
                            justifyContent="flex-start"
                            variant="outline"
                            borderRadius="2xl"
                            fontSize="15px"
                            pr="10px"
                            pl="6px"
                            bgColor="#F3F4F6"
                            borderColor="#FFFFFF"
                            _hover={{ bg: "gray.500", textColor: "white" }}
                            textColor="gray.800"
                            whiteSpace="normal"
                            className="text-[14px] py-[2px] rounded-full flex items-center gap-1 border border-gray-800 dark:border-gray-600" // Key changes here
                          >
                            <Icon as={suggestion.icon} boxSize={4} />
                            <span className="flex-1 text-left font-normal text-gray-700">{suggestion.text}</span> {/* Key change here */}
                          </Button>
                        ))}
                      </Flex>
                    </InputLeftElement>
                  </InputGroup>
                </Flex>


              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Flex flexDir="row" justifyContent="space-between" className="mx-4 mt-[2vh]" alignItems="baseline">
          <p className={cn('text-[20px]', LexendFont.className)}>
            Outfit Calendar
          </p>
          <Link href={isLoggedIn ? "/dashboard/ootd/calendar" : "/sign-up"} onClick={() => { setIsLoading(true) }} >
            <Button variant="ghost">
              <PiArrowRight strokeWidth="1.3" size="24px" height="20px" />
            </Button>
          </Link>
        </Flex>
        <Box
          className="w-full card-shadow bg-[#FFFFFF] h-[27vh] relative" mx="auto" maxW="container.lg"
          overflowX="auto"
        >
          {imagesLoading && isLoggedIn ? (
            <Box className="w-full card-shadow bg-[#FFFFFF] noscrollbar" mt={0} p={3} mx="auto" maxW="container.lg"
              overflowX="auto" overflowY="hidden" >
              <Spinner mx="auto" size='md' color='purple.500' />
            </Box>
          ) :
            (
              <Box className="w-full card-shadow bg-[#FFFFFF] noscrollbar" mt={0} p={3} mx="auto" maxW="container.lg"
                overflowX="auto" overflowY="hidden" >
                <HStack spacing={-5} shouldWrapChildren={true} mx={1} height="full" >

                  {images.map((image, index) => (
                    <Link key={index} href={isLoggedIn ? "/dashboard/ootd" : "/sign-in"} onClick={() => setIsLoading(true)}>
                      <Box
                        key={index}
                        boxSize="14vh" // Fixed width for the container
                        height="21vh"
                        overflow="clip" // Clip overflowing content
                        borderRadius="2xl" // Apply border radius to the container
                        position="relative"
                        border="2px"
                        zIndex={images.length - index}
                        ml={index === 0 ? 0 : -5}
                        bgColor="gray.200"
                        alignItems="center"
                        justifyItems="center"
                        className="ring-1 ring-inset"
                      >
                        <div className="h-full flex items-center justify-center">
                          <img
                            className="ring-1 ring-gray-900/10 rounded-2xl max-w-[150%]"
                            src={image}
                            alt=""
                            width="200%" // Ensure the image fills the container width
                            height="21vh" // Ensure the image fills the container height
                            style={{ objectFit: 'cover', filter: 'contrast(1.1) saturate(1.1)' }}
                          />
                        </div>
                      </Box>
                    </Link>
                  ))}

                </HStack>
              </Box>
            )
          }
        </Box>
      </div >
    </MaxWidthWrapper>
  );
};

export default AskCoco;



// import { Card, CardHeader, CardBody, CardFooter, Image } from '@nextui-org/react';
import { Box, Flex, Text, Heading, Button, InputGroup, InputLeftElement, Input, IconButton, HStack, Textarea, Icon } from '@chakra-ui/react'; // Import from Chakra UI
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { Upload, Sparkles, Star, Search, Camera, ChevronRight, CircleArrowRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Inter, Glass_Antiqua, Work_Sans, Lexend, Manrope } from 'next/font/google';
import { PiQuestionMark, PiCheckCircleLight, PiArrowRight } from "react-icons/pi";
import MaxWidthWrapper from './MaxWidthWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
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

const images = [
  '/image2.jpg',
  '/image3.jpg',
  '/image1.jpg',
  '/placeholder.jpg',
  '/placeholder.jpg',
  '/placeholder.jpg',


  // ... more images
];

const AskCoco = ({
  user,
}: {
  user: KindeUser | null;
}) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  var greeting = currentHour < 12 ? "Good Morning" : (currentHour < 17 ? "Good Afternoon" : "Good Evening");
  const randomEvent = events[Math.floor(Math.random() * events.length)];
  const [placeholderText, setPlaceholderText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentEvent, setCurrentEvent] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');

  useEffect(() => {
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentEvent(randomEvent);
    setCurrentQuestion(randomQuestion);
    const fullPlaceholderText = `Write your own question`;

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

  const handleFocus = () => {
    setInputValue(placeholderText);
  };



  return (
    <MaxWidthWrapper className='' >
      <div className="mt-[9vh] h-screen">
        <div className='mx-4 mt-[1vh] mb-1'>
          <h1 className={cn(LexendFont.className, "text-[28px] mt-[14vh] font-normal text-[#190F38] dark:text-white font-display")} >
            {/* {greeting}, <span className='font-bold'>{user?.given_name}!</span> */}
            Hey, {user?.given_name}
          </h1>
          <h2 className={cn('text-[20px] mt-[1vh]', LexendFont.className)}>
            Ask Coco?
          </h2>
        </div>
        <Box className="relative w-full card-shadow bg-white " px={3} borderRadius="20px" mx="auto" maxW="container.lg" >
          <Flex gap={4}>
            <Flex flexDir="row" className="h-[30vh]">
              <Box width="1/3" justifyContent="center" ml="5px" alignItems="center" display="flex" flexDir="column" rounded={"10px"} >
                {/* Background Div for the Upload Icon */}
                <div className=" my-2 bg-[#EAECEF] h-full  w-[36vw] rounded-lg flex flex-col ">
                  {/* Upload Icon */}
                  <div className='items-center justify-center flex flex-col h-full'>
                    <Camera height={25} width={25} color="gray" />
                    {/* Upload Image Text */}
                    <Text className="font-normal" mt={2} fontSize="sm" color="gray" paddingRight={5} paddingLeft={5} align="center" >
                      Upload Outfit
                    </Text>
                  </div>
                </div>
              </Box>
              <Flex ml={4} flexDir="column" alignItems="left" justifyContent="space-between" width="1/2">
                <Flex flexDir="column">
                  <InputGroup my={2} mb={1} borderRadius="xl" height="11vh" backgroundColor="#EDF2F7">
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
                      height="12vh"
                      // pt="1vh"
                      fontSize="16px"
                      lineHeight="20px"
                      overflowWrap="break-word"
                      textColor="black"
                      _placeholder={{ color: 'black' }}
                      borderRadius="xl"
                      pl="9vw">
                    </Textarea>
                  </InputGroup>
                  <Flex flexDir="row" justify="end">
                    {/* <Button width="fit-content" height="26px" backgroundColor="#7E43AB" textColor="#FFFFFF" borderRadius="xl" > Ask </Button> */}
                  </Flex>
                </Flex>
                <div className={cn(workSansFont.className, 'mt-2 mb-2 ml-1 h-full flex flex-row justify-between items-end text-base font-bold')}>
                  <span className={cn(LexendFont.className, 'text-sm')}>Suggestions</span>
                  <Button width="fit-content" height="26px" backgroundColor="#7E43AB" textColor="#FFFFFF" borderRadius="xl" > Ask </Button>

                </div>
                <Flex flexDir="column" gap={2} alignItems="flex-start" justifyContent="flex-end" height="100%" marginBottom="1vh" >
                  {[{ icon: PiQuestionMark, text: "Accessorize this" }, { icon: PiCheckCircleLight, text: "Am I ready to go?" }].map((suggestion) => (
                    <Button
                      key={suggestion.text}
                      size="small"
                      width="fit-content"
                      height="26px"
                      justifyContent="flex-start"
                      variant="outline"
                      borderRadius="2xl"
                      fontSize="12px"
                      bgColor="#F3F4F6"
                      borderColor="#FFFFFF"
                      _hover={{ bg: "gray.500", textColor: "white" }}
                      textColor="gray.800"
                      whiteSpace="normal"
                      className="text-[14px] px-2 py-4 rounded-full flex items-center gap-1 border border-gray-800 dark:border-gray-600" // Key changes here
                    >
                      <Icon as={suggestion.icon} boxSize={6} />
                      <span className="flex-1 text-left font-normal text-gray-700">{suggestion.text}</span> {/* Key change here */}
                    </Button>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Flex flexDir="row" justifyContent="space-between" className="mx-4 mt-[2vh]" alignItems="baseline">
          <p className={cn('text-[20px]', LexendFont.className)}>
            Outfit Calendar
          </p>
          <Button variant="ghost">
            <PiArrowRight strokeWidth="1.3" size="24px" height="20px" />
          </Button>
        </Flex>
        <Box
          className="w-full card-shadow bg-[#FFFFFF] h-[27vh]" mx="auto" maxW="container.lg"
          overflowX="auto"
        >
          <Box className="w-full card-shadow bg-[#FFFFFF] noscrollbar" mt={0} p={3} mx="auto" maxW="container.lg"
            overflowX="auto" overflowY="hidden" >
            <HStack spacing={-5} shouldWrapChildren={true} mx={1} height="full">
              {images.map((image, index) => (
                <Box
                  key={index}
                  boxSize="14vh" // Fixed width for the container
                  height="21vh"
                  overflow="clip"  // Clip overflowing content
                  borderRadius="2xl"  // Apply border radius to the container
                  position="relative"
                  border="2px"
                  zIndex={images.length - index}
                  ml={index === 0 ? 0 : -5}
                  bgColor="#E8D2F6"
                  alignItems="center"
                  justifyItems="center"
                  className=' ring-1 ring-inset '
                >
                  <div className='h-full ring-1 ring-insetitems-center justify-center align-middle '>
                    <Image className='ring-1 ring-gray-900/10 rounded-2xl ' src={image} alt="" width={120} height={300} style={{ filter: 'contrast(1.1) saturate(1.1)' }} />
                  </div>
                </Box>
              ))}
            </HStack>
          </Box>
        </Box>
      </div >
    </MaxWidthWrapper>
  );
};

export default AskCoco;

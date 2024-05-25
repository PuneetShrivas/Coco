// import { Card, CardHeader, CardBody, CardFooter, Image } from '@nextui-org/react';
import { Box, Flex, Text, Heading, Button, InputGroup, InputLeftElement, Input, IconButton, HStack } from '@chakra-ui/react'; // Import from Chakra UI
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { Upload, Sparkles, Star, Search, Camera, ChevronRight, CircleArrowRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Inter, Glass_Antiqua, Work_Sans } from 'next/font/google';
import MaxWidthWrapper from './MaxWidthWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
const glassAntiquaFont = Glass_Antiqua({ weight: '400', subsets: ['latin'] })
const workSansFont = Work_Sans({ weight: '600', subsets: ['latin'] })
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
  '/image4.jpg',
  '/image5.jpg',
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
    const fullPlaceholderText = `${randomQuestion} ${randomEvent}`;

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
    <MaxWidthWrapper className='grainy' >
      <div className="mt-[70px] h-screen">
        <div className='mx-4 mt-2 mb-1'>
          <h1 className="text-base font-normal text-[#190F38] dark:text-white font-display" style={{ fontFamily: 'Inter' }}>
            {greeting}, <span className='font-bold'>{user?.given_name}!</span>
          </h1>
        </div>
        <Box className="relative w-full card-shadow bg-[#CCE5E3] " p={3} borderRadius="20px" mx="auto" maxW="container.lg" shadow={"2xl"}>
          <Flex flexDir="row" style={{ fontFamily: 'Inter' }} className='px-4 mt-[16px] absolute inset-0 z-20' mr="4px" maxHeight={"22px"} justifyContent={"space-between"} height={"full"}>
            <p className='text-large font-bold'>
              Styled For Today?
            </p>
            <IconButton isRound={true} aria-label="Ask Coco" className='rounded-full bg-white' height={"40px"} width={"fit-content"} icon={<ArrowRight size={"16px"} />} />
          </Flex>
          <Flex gap={4} className='mt-[36px]'>
            <Flex flexDir="row">
              <Box width="1/3" justifyContent="center" ml="5px" my="5px" alignItems="center" display="flex" flexDir="column" rounded={"10px"} shadow={"base"}>
                {/* Background Div for the Upload Icon */}
                <div className="bg-[#BBE2CD] h-40 w-[35vw] rounded-lg flex flex-col ">
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
                <div className={cn(workSansFont.className, 'mt-2 mb-2 ml-1 h-full flex items-end text-base font-bold')}>
                  <CheckCircle className="inline-block align-text-bottom mr-1 text-dark-circle-color" strokeWidth={0.75} />
                  <span className='inline-block align-text-bottom'>Ask Coco</span>
                </div>
                <Flex flexDir="column" gap={2} alignItems="flex-start" justifyContent="flex-end" height="100%" marginBottom="8px" >
                  {["Am I ready to go?", "Accessorize this", "Suggest footwear"].map((suggestion) => (
                    <Button
                      key={suggestion}
                      // leftIcon={<Sparkles color="gold" size={10} />}
                      size="small"
                      width="fit-content"
                      height="26px"
                      justifyContent="flex-start"
                      variant="outline"
                      borderRadius="2xl"
                      borderColor="#656363"
                      _hover={{ bg: "gray.500", textColor: "white" }}
                      textColor="gray.800"
                      whiteSpace="normal"
                      className="text-[14px] px-3 py-2 rounded-full flex items-center gap-1 border border-gray-800 dark:border-gray-600" // Key changes here
                    >
                      <span className="flex-1 text-left font-normal text-gray-700">{suggestion}</span> {/* Key change here */}
                    </Button>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <div className='shadow-inner rounded-2xl'>
            <InputGroup mt={2} mb={1} size="md" borderRadius="2xl" backgroundColor="#EDF2F7"  >
              <InputLeftElement pointerEvents='none'>
                <Search color='black' size={20} />
              </InputLeftElement>
              <Input
                type='text'
                placeholder={placeholderText}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={handleFocus}
                focusBorderColor='gray.800'
                _placeholder={{ color: 'gray.500' }}
                borderRadius="2xl"
              />
            </InputGroup>
          </div>
        </Box>
        <Box
          className="w-full card-shadow bg-[#FFFFFF] h-[230px]" mt={5} borderRadius="30px" mx="auto" maxW="container.lg"
          overflowX="auto" shadow={"xl"}
        >
          <Box className="w-full card-shadow bg-[#2F2F2F] h-[180px] noscrollbar" mt={0} p={3} borderRadius="30px" mx="auto" maxW="container.lg"
            overflowX="auto" overflowY="hidden" shadow={"xl"} >
            <HStack spacing={1} shouldWrapChildren={true} mx={1} height="full">
              {images.map((image, index) => (
                <Box
                  key={index}
                  boxSize="96px" // Fixed width for the container
                  height="140px"
                  overflow="clip"  // Clip overflowing content
                  borderRadius="2xl"  // Apply border radius to the container
                  position="relative"
                  border="2px"
                  zIndex={images.length - index}
                  ml={index === 0 ? 0 : 1}
                  bgColor="#E8D2F6"
                  alignItems="center"
                  justifyItems="center"
                  className=' ring-1 ring-inset '
                >
                  <div className='h-full ring-1 ring-insetitems-center justify-center align-middle '> <Image className='ring-1 ring-gray-900/10 rounded-2xl ' src={image} alt="" width={96} height={240} style={{ filter: 'contrast(1.1) saturate(1.1)' }} /></div>
                </Box>
              ))}
            </HStack>
          </Box>
          <div className="flex flex-row mt-2 mx-5 justify-between" >
            <span className='text-large font-bold mx-3 antialiased' style={{ fontFamily: 'Inter' }}> Outfit Calendar</span>
            {/* <div className='flex flex-col'> <span className='text-xs inline-block align-middle font-bold'> Streak </span> <span className='text-xs inline-block align-middle text-gray-500'> 5 days </span></div> */}
            <Button className='flex flex-col' bgColor={"#CCE5E3"} variant={"solid"} size="sm">
              <span className='absolute inset-0 px-2 py-1'>
                <ArrowRight size={"12px"} strokeWidth={3} />
              </span>
              <span className='font-bold text-small ml-2' style={{ fontFamily: 'Inter' }}>
                Go
              </span>
            </Button>
          </div>
        </Box>
      </div >
    </MaxWidthWrapper>
  );
};

export default AskCoco;

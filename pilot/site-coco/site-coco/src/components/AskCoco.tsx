// import { Card, CardHeader, CardBody, CardFooter, Image } from '@nextui-org/react';
import { Box, Flex, Text, Heading, Button, InputGroup, InputLeftElement, Input } from '@chakra-ui/react'; // Import from Chakra UI
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { Upload, Sparkles, Star, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Inter, Glass_Antiqua, Work_Sans } from 'next/font/google';
import MaxWidthWrapper from './MaxWidthWrapper';
import Link from 'next/link';
const glassAntiquaFont = Glass_Antiqua({ weight: '400', subsets: ['latin'] })
const workSansFont = Work_Sans({ weight: '400', subsets: ['latin'] })
const interFont = Inter({ subsets: ['latin'] });
const events = ["date", "wedding", "beach party", "job interview", "festival"];
const questions = [
  "What should I wear to a",
  "Give me outfit ideas for a",
  "Help me buy a dress for a",
  "Suggest accessories for a",
  "What's the best outfit for a"
];

const AskCoco = ({
  user,
}: {
  user: KindeUser | null;
}) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const greeting = currentHour < 12 ? "Good Morning" : "Good Evening";
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
    <MaxWidthWrapper >
      <div className="mt-2 mx-2">
        <div >
          <h1 className="text-2xl font-bold text-[#190F38] dark:text-white font-display" style={{ fontFamily: 'Inter' }}>
            {greeting}, <span className='gradient-text'>{user?.given_name}!</span>
          </h1>
        </div>
        <div style={{ fontFamily: 'Inter' }}>
          <p className="text-2xl mb-6 font-bold text-[#B7A0DB] dark:text-white tracking-tight">
            Are you styled for today?
          </p>
        </div>
        <div>
  <InputGroup mt={1} mb={4} size="md" borderRadius="2xl" backgroundColor="white">
    <InputLeftElement pointerEvents='none'>
      <Search color='black' size={20} />
    </InputLeftElement>
    <Input
      type='text'
      placeholder={placeholderText}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onFocus={handleFocus}
      focusBorderColor='purple.500'
      _placeholder={{ color: 'gray.500' }}
      borderRadius="2xl"
    />
  </InputGroup>
</div>

        {/* Ask Coco Heading (Moved outside the card) */}

        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Heading
            size="sm"
            className={`mb-2 ml-2 text-left ${interFont.className}`}
            fontWeight="normal"
            color="#160F33"

          >
            ✨ Ask Coco
          </Heading>
          <div className='mr-2 mb-2 text-xs underline underline-offset-2 font-normal dark:text-white text-purple-700'>
            <Link href="/assistant" > 
            </Link>
          </div>
        </Flex>


        <Box className="w-full card-shadow bg-white" p={3} borderRadius="lg" mx="auto" maxW="container.lg">
          <Flex gap={4}>
            <Flex flexDir="row">
              <Box width="1/3" justifyContent="center" alignItems="center" display="flex" flexDir="column">
                {/* Background Div for the Upload Icon */}
                <div className="bg-gray-200 h-40 w-[35vw] rounded-lg flex flex-col items-center justify-center">
                  {/* Upload Icon */}
                  <Upload height={15} width={15} color="black" />

                  {/* Upload Image Text */}
                  <Text mt={2} fontSize="sm" color="gray.500" paddingRight={5} paddingLeft={5} align="center">
                    Upload Your Outfit Image
                  </Text>
                </div>
              </Box>

              <Flex ml={4} flexDir="column" alignItems="left" justifyContent="space-between" width="1/2">


                <Flex flexDir="column" gap={2} alignItems="flex-start" justifyContent="flex-end" height="100%">
                  {["Am I ready to go?", "Give outfit ideas", "Accessorize this", "Suggest footwear"].map((suggestion) => (
                    <Button
                      key={suggestion}
                      leftIcon={<Sparkles color="gold" size={10} />}
                      size="xs"
                      width="fit-content"
                      height="25px"
                      justifyContent="flex-start"
                      variant="outline"
                      colorScheme="gray"
                      borderRadius="2xl"
                      _hover={{ bg: "gray.200" }}
                      whiteSpace="normal"
                      className="text-xs bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 py-2 rounded-full flex items-center gap-1 border border-gray-300 dark:border-gray-600" // Key changes here
                    >
                      <span className="flex-1 text-left font-normal text-purple-700">{suggestion}</span> {/* Key change here */}
                    </Button>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        {/* New Outfit Calendar Section */}
        <Flex flexDir="row" justifyContent="space-between" alignItems="center" mt={5}>
          <Heading
            size="sm"
            className={`mb-2 ml-2 text-left ${interFont.className}`}
            fontWeight="normal"
            color="#160F33"
          >
            📅 Outfit Calendar
          </Heading>
          <div className='mr-2 mb-2 text-xs underline underline-offset-2 font-normal dark:text-white text-purple-700'>
            <Link href="#"> See All</Link>
          </div>
        </Flex>
        <Box
          className="w-full card-shadow bg-white" p={3} borderRadius="lg" mx="auto" maxW="container.lg"
          overflowX="auto"
        >
          <Flex gap={2}>
            {Array.from({ length: 4 }, (_, index) => (
              <Flex key={index} flexDir="column" alignItems="center" shrink={0}> {/* Nested Flex */}
                <Box
                  className="bg-gray-200 h-[200px] w-28 rounded-lg relative" // Added relative positioning to the outer box
                >
                  {/* Date Box (Positioned Inside) */}
                  <Box
                    borderWidth={1}
                    borderColor="gray.300"
                    backgroundColor="white"
                    borderRadius="md"
                    textAlign="center"
                    px={2}
                    py={1}
                    width="24"
                    position="absolute"
                    bottom={2}
                    left="50%"
                    transform="translateX(-50%)"
                  >
                    <Text fontSize="xs">
                      {new Date(Date.now() - index * 86400000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </Text>
                  </Box>
                </Box>

              </Flex>
            ))}
          </Flex>
        </Box>
      </div >

    </MaxWidthWrapper>

  );
};

export default AskCoco;

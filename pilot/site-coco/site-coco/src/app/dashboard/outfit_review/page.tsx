"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
    Image,
    Text,
    Link,
    Textarea,
    Box,
    Flex,
    Button,
    Spinner,
    IconButton,
    Icon,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton,
} from "@chakra-ui/react";
import { ArrowLeft, Camera, Shirt, NotebookPen, ArrowUpIcon, ChevronDownIcon, ChevronUpIcon, Sparkles } from "lucide-react";
import { Manrope, Lexend } from "next/font/google";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { db } from "@/db";
import FileUpload from "@/components/FileUpload";
import mixpanel from "mixpanel-browser";

const lexendFontSeven = Lexend({ weight: "700", subsets: ["latin"] });
const lexendFont = Lexend({ weight: "400", subsets: ["latin"] });
const manrope = Manrope({ weight: "400", subsets: ["latin"] });

interface Product {
    ProductName: string;
    Brand: string;
    Image: string;
    Buy: string;
}

interface ChatMessage {
    role: string;
    content: string;
    isLoading?: boolean;
    questionsAndProducts?: {
        questions: string[];
        products: { products: Product[] }[]; // Assuming Product is another interface you've defined
    };
}
function OutfitReviewPage() {
    const searchParams = useSearchParams();
    var imageDataUrl = searchParams.get("imageDataUrl");
    const [dots, setDots] = useState('.');
    const queryText = searchParams.get("queryText");
    const [showQuestions, setShowQuestions] = useState(false);
    const metaId = searchParams.get("metaId");
    const lat = Number(searchParams.get("lat"));
    const long = Number(searchParams.get("long"));
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [dressDescription, setDressDescription] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { role: "user", content: queryText ?? "" },
    ]);
    const [newQuery, setNewQuery] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [activeResponseIndex, setActiveResponseIndex] = useState<number | null>(
        0
    );
    const [genderFemale, setGenderFemale] = useState<boolean | undefined>(false);

  useEffect(() => {
    const metasString = localStorage.getItem("metas");
    if (metasString) {
      try {
        const metas = JSON.parse(metasString);
        setGenderFemale(metas.genderFemale);
      } catch (error) {
        console.error("Error parsing metas from localStorage:", error);
        // You might want to handle this error differently (e.g., set a default value or show a message)
      }
    }
  }, []);
    const [isLoading, setIsLoading] = useState(false);
    const [saveChatHistory, setSaveChatHistory] = useState(true);
    const [firstResponse, setFirstResponse] = useState(true);
    const [apiCalled, setApiCalled] = useState(false);
    const [cocoResponse, setCocoResponse] = useState("Coco is looking at your outfit 🔎"); // Initial Coco response
    const router = useRouter();
    const [canGetCocoResponse, setCanGetCocoResponse] = useState(true);
    const [questions, setQuestions] = useState<string[]>([]);

    const toggleResponse = (index: number) => {
        setActiveResponseIndex(activeResponseIndex === index ? null : index);
        console.log("index", index);
        console.log("active index", activeResponseIndex);
    };

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;
        if (isLoading) {
            interval = setInterval(() => {
                setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : '.'));
            }, 500); // Adjust the animation speed as needed
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval); // Clean up interval on unmount
    }, [isLoading]);

    const handleContinueChat = () => {
        setShowChat(true); // Show the chat input area
    };

    const initialChatSessionId = uuidv4();
    const [chatSessionId, setChatSessionId] = useState<string>(initialChatSessionId);

    const handleSend = async () => {
        setSaveChatHistory(true);
        if (newQuery.trim() !== "") {
            // Add user's query and a loading message to the chat history
            setChatHistory((prev) => [
                ...prev,
                { role: "user", content: newQuery },
                { role: "assistant", content: "", isLoading: true },
            ]);
            setNewQuery(""); // Clear input field
            await getOutfitReview(newQuery); // Fetch the review
        }
    };
    const [ipAddress, setIpAddress] = useState<string | null>(null);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openModal = (product: Product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const handleQuestionClick = (question: string) => {
        setNewQuery(question);
        setShowChat(true);
    };

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
            mixpanel.track("outfit_review", { $ip: ipAddress });
        }
    }, [ipAddress]);
    useEffect(() => {
        // Add initial query to chatHistory when page loads and set isLoading for it
        if (queryText && imageDataUrl) {
            setChatHistory([
                { role: "user", content: queryText },
                { role: "assistant", content: "", isLoading: true }, // Add loading message
            ]);
            fetch(imageDataUrl)
                .then((res) => res.blob())
                .then(setImageBlob)
                .then(() => getOutfitReview()); // Fetch outfit review immediately after image load
        }
    }, [queryText, imageDataUrl]); // Run only once when the page loads

    const handleDeleteImage = () => {
        setImageBlob(null);
    };

    const handleChangeImage = () => {
        router.back(); // Navigate back to the previous page
    };

    const getCocoResponse = async () => {
        if (imageBlob) {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("file", imageBlob, "image.jpg");

            try {
                const response = await fetch(
                    "https://iosphere.org/app/dress_description/get_dress_description/",
                    {
                        method: "POST",
                        body: formData,
                        headers: { accept: "application/json" },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setCocoResponse("Coco's Review");
                    setDressDescription(data.description);
                } else {
                    setCocoResponse("Error 🤖");
                    setDressDescription(
                        "There was an error processing the request"
                    );
                }
            } catch (error) {
                console.error("Error fetching Coco response:", error);
                setCocoResponse("Error 🤖");
                setDressDescription(
                    "There was an error processing the request"
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    const getOutfitReview = async (query: string = queryText ?? "") => {
        if (dressDescription && query) {
            try {
                const response = await fetch(
                    `https://iosphere.org/app/outfit_review/get_review/?dress_description=${encodeURIComponent(
                        dressDescription
                    )}&query=${encodeURIComponent(query)}&user_id=${encodeURIComponent(metaId ?? "")}&lat=${encodeURIComponent(lat)}&long=${encodeURIComponent(long)}`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            chat_history: chatHistory.filter(item => !item.isLoading), // Take the last two items (question and answer)
                        }),
                        headers: {
                            accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    

                    const parsedResponse = JSON.parse(data.response.answer);
                    let contentStrings: string[] = [];

                    // Check if the parsed answer is an array of objects
                    if (Array.isArray(parsedResponse)) {
                        contentStrings = parsedResponse
                            // .filter((item: any) => item.tag === "review") // Filter review items
                            .flatMap((item: any) => {
                                // Assuming item.content can be a string or an array of strings
                                return Array.isArray(item.content) ? item.content : [item.content];
                            });
                    } else {
                        console.error("Unexpected response format:", data.response.answer);
                    }

                    const questionsResponse = await fetch(
                        `https://iosphere.org/app/questions_products/get_questions_and_products/?products_n=5&questions_n=3&gender_female=${genderFemale}`,
                        {
                            method: "POST",
                            headers: {
                                accept: "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                chat_history: contentStrings,
                            }),
                        }
                    );

                    if (questionsResponse.ok) {
                        const questionsData = await questionsResponse.json();
                        setQuestions(questionsData.response.questions);
                        // Combine responses (handle questionsData as needed)
                        console.log("chat history before saving was: ", chatHistory)
                        if(chatHistory.length===2){
                            const newChatHistory=[
                                ...chatHistory.slice(0,-1),
                                {
                                    role: "assistant",
                                    content: data.response.answer, // Original outfit review
                                    questionsAndProducts: questionsData.response, // New questions and products
                                    isLoading: false,
                                },
                            ]
                        } else {
                            const newChatHistory=[
                            ...chatHistory,
                            {
                                role:"user",
                                content:query
                            },
                            {
                                role: "assistant",
                                content: data.response.answer, // Original outfit review
                                questionsAndProducts: questionsData.response, // New questions and products
                                isLoading: false,
                            },
                        ]
                        }
                        const newChatHistory=[
                            ...chatHistory,
                            {
                                role:"user",
                                content:query
                            },
                            {
                                role: "assistant",
                                content: data.response.answer, // Original outfit review
                                questionsAndProducts: questionsData.response, // New questions and products
                                isLoading: false,
                            },
                        ]
                        {
                            console.log("saving new chat history with: ", newChatHistory)
                            const saveChatResponse = await fetch("/api/user/save_chat_session", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    chat_session_id: chatSessionId, // Send the chat session ID
                                    chat_history: newChatHistory, // Send the full chat history
                                    query: query,  
                                }),
                            });
        
                            if (saveChatResponse.ok) {
                                setSaveChatHistory(false);
                            } else {
                                throw new Error("Failed to save chat session");
                            }
                        }
                        setChatHistory((prev) => {
                            const newChatHistory=[
                            ...prev.slice(0, -1),
                            {
                                role: "assistant",
                                content: data.response.answer, // Original outfit review
                                questionsAndProducts: questionsData.response, // New questions and products
                                isLoading: false,
                            },
                        ]
                        
                        return newChatHistory;
                    });
                    } else {
                        throw new Error("Failed to get questions and products");
                    }
                    if (firstResponse) {
                        setActiveResponseIndex(1);
                        setFirstResponse(false);
                        console.log(chatHistory.length)
                    } else {
                        console.log("prev:", activeResponseIndex)
                        setActiveResponseIndex(chatHistory.length + 1);
                        console.log("setting to:", chatHistory.length + 1)
                        console.log("now:", activeResponseIndex)
                    }

                    mixpanel.track('outfit_review_questions', {
                        $ip: ipAddress,
                        query: query,
                        dressDescription: dressDescription,
                        cocoResponse: data.response.answer
                    });

                } else {
                    throw new Error("Failed to get outfit review");
                }
            } catch (error) {
                console.error("Error getting or saving outfit review:", error);
                setChatHistory((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: "There was an error processing the request",
                        isLoading: false,
                    },
                ]);
            }
        }
    };



    useEffect(() => {
        if (dressDescription && !showChat) {
            // Delay to ensure that the UI is updated with "Coco is thinking..." before the API call
            const timeoutId = setTimeout(() => {
                getOutfitReview();
            }, 500);
            return () => clearTimeout(timeoutId); // Clear timeout if component unmounts
        }
    }, [dressDescription]);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleImageUpload = (file: File | null) => {
        setImageBlob(file);
        if (imageBlob) {
            imageDataUrl = URL.createObjectURL(imageBlob)
        }
        onClose();
        setApiCalled(false);
        setCanGetCocoResponse(true);
        setChatHistory([]) // Reset apiCalled to trigger new analysis
    };

    useEffect(() => {
        if (imageBlob && canGetCocoResponse) {
            setCocoResponse("Coco is looking at your outfit 🔎");
            setIsLoading(true);
            getCocoResponse();
            setCanGetCocoResponse(false)
        } else {
            // Reset everything when image is deleted
            setCocoResponse("");
            setDressDescription("");
            setIsLoading(false);
        }
    }, [imageBlob]); // Run whenever imageBlob changes (upload or delete)



    return (
        <div className="bg-white h-[100vh] flex flex-col">
            <p className="bg-white mb-[8vh] text-white">-</p>
            <Flex flexDirection="column" className={lexendFontSeven.className} >
                <Link href="/dashboard">
                    <IconButton aria-label="Go back" icon={<ArrowLeft />} rounded="full" mx="5vw" />
                </Link>

                {/* Image Thumbnail and Buttons */}
                <Flex mt={4} alignItems="center" gap={4} ml="6vw" mb={5} >
                    <Button px="0" boxSize="12.5vh" onClick={onOpen} bgColor="#FAFBFB" >
                        <Box
                            className="bg-[#EAECEF] rounded-md flex items-center justify-center"
                            onClick={onOpen} // Open drawer on image click
                            cursor={imageBlob ? "pointer" : "default"} // Change cursor on hover if image is present
                        >
                            {imageBlob ? (
                                <Image
                                    src={imageDataUrl ?? ""}
                                    alt="Outfit"
                                    boxSize="12.5vh"
                                    borderRadius="md"
                                    objectFit="cover"
                                />
                            ) : (
                                <Camera height={20} width={20} color="gray" />
                            )}
                        </Box>
                    </Button>
                    <Flex flexDir="column" gap={3}>
                        <Button
                            leftIcon={<AiOutlineDelete color="#C4EB5F" />}
                            color="#C4EB5F"
                            rounded="xl"
                            border="1px"
                            variant="outline"
                            onClick={handleDeleteImage}
                            isDisabled={!imageBlob} // Disable if no image
                        >
                            Delete
                        </Button>
                        <Button
                            leftIcon={<AiOutlineEdit color="#C4EB5F" />}
                            color="#C4EB5F"
                            rounded="xl"
                            border="1px"
                            variant="outline"
                            onClick={onOpen} // Open drawer to change image
                            isDisabled={!imageBlob} // Disable if no image
                        >
                            Change
                        </Button>
                    </Flex>
                </Flex>

                <div className="mx-4 overflow-x-auto scrollbar-hide">
                        {!isLoading && dressDescription ? (
                            <Flex className="mb-1 mx-1 whitespace-nowrap" gap={2}>
                                {/* Pills in a Row (Removed flexDir) */}
                                {dressDescription.split(/[,.;]\s*/)
                                    .filter((desc) => desc.trim() !== "")
                                    .map((desc, index) => (
                                        <Box
                                            key={index}
                                            px={4}
                                            py={2}
                                            bg="white"
                                            rounded="full"
                                            shadow="md"
                                            borderWidth="1px"
                                            borderColor="gray.200"
                                            className={cn(manrope.className, "text-sm")}
                                        >
                                            {desc.trim()}
                                        </Box>
                                    ))}
                            </Flex>
                        ):(
                            <Flex className="mb-1 mx-1 whitespace-nowrap" gap={2}>
                            {[...Array(3)].map((_, index) => (
                                <Skeleton
                                  key={index}
                                  height="32px" // Adjust to match your pill height
                                  width="800px"
                                  rounded="full"
                                  shadow="md"
                                  startColor="gray.200"
                                  endColor="gray.300"
                                  px={4} // Match padding of description pills
                                  py={2} 
                                  borderWidth="1px"
                                  borderColor="gray.200"
                                   // Make Skeleton disappear when not loading
                                  className={cn(manrope.className, "text-sm")}
                                >
                                </Skeleton>
                              ))}
                              </Flex>

                        )}
                </div>

                {/* Chat History (with Flex for scrolling) */}
                <div className="flex-grow mx-4 overflow-y-auto mb-[10vh]">
                    <Flex flexDir="column" gap={1}>
                        {chatHistory.map((item, index) => (
                            <Flex
                                key={index}
                                mt={index === 0 ? 4 : 2}
                                direction={item.role === "user" ? "row-reverse" : "row"}
                                align="flex-start"
                            >
                                {/* User message */}
                                {item.role === "user" && (
                                    <Text className={cn(lexendFontSeven.className, "text-[18px] ml-[3vw] text-purple-500")}>
                                        {item.content}
                                    </Text>
                                )}

                                {/* Assistant's Response */}
                                {item.role === "assistant" && (
                                    <Box

                                        mt={2}
                                        width="100%"
                                        p={4}
                                        bg="#e8eded"
                                        borderRadius="xl"
                                        className={`relative ${activeResponseIndex === index ? "" : "max-h-[50px]  overflow-hidden"}`}
                                    >
                                        {/* Dropdown Icon */}
                                        <Icon
                                            as={
                                                activeResponseIndex === index ? ChevronUpIcon : ChevronDownIcon
                                            }
                                            onClick={() => toggleResponse(index)}
                                            boxSize={6}
                                            position="absolute"
                                            top={4}
                                            right={2}
                                            color="gray.500"
                                        />

                                        {/* Coco's Response */}
                                        <Text
                                            mb={2}
                                            fontSize="16px"
                                            lineHeight="26px"
                                            fontWeight={400}
                                            className={lexendFont.className}
                                            color="#9ea0a3FF"
                                        >
                                            <Flex alignItems="center" flexDir="row">
                                                {item.isLoading ? (
                                                    <>
                                                    <Spinner
                                                        size="sm"
                                                        thickness="2px"
                                                        color="purple.500" // Purple color
                                                        mr="5px"
                                                    />
                                                    <span>
                                                    Coco is thinking... 
                                                    </span>
                                                    </>
                                                ):(
                                                <span> {/* Wrap text in a span for better control */}
                                                    {cocoResponse}
                                                </span>
                                                )}
                                                
                                            </Flex>
                                        </Text>

                                        {/* Outfit Review */}
                                        {!item.isLoading &&
                                            item.content &&
                                            JSON.parse(item.content).map((messageItem: any, messageIndex: number) =>
                                                messageItem.tag === "review" ? (
                                                    <Text
                                                        key={messageIndex}
                                                        className={cn(manrope.className, "text-sm")}
                                                    >
                                                        {messageItem.content}
                                                    </Text>
                                                ) : null // Filter out non-review items
                                            )}

                                        {/* Actionable Items with Product Images */}
                                        {!item.isLoading &&
                                            item.content &&
                                            JSON.parse(item.content).some(
                                                (messageItem: any) => messageItem.tag === "actionable"
                                            ) && (
                                                <>
                                                    {/* ... (Heading: You can try the following) */}
                                                    <Flex flexWrap="wrap" gap={2}>
                                                        {JSON.parse(item.content)
                                                            .filter((messageItem: any) => messageItem.tag === "actionable")
                                                            .map((messageItem: any, messageIndex: number) => (
                                                                <Box
                                                                    key={messageIndex}
                                                                    p={2}
                                                                    bg="white"
                                                                    rounded="md"
                                                                    shadow="sm"
                                                                    border="1px solid gray"
                                                                    className={cn(manrope.className, "text-sm")}
                                                                >
                                                                    {messageItem.content}

                                                                    {/* Product Image Carousel (if available) */}
                                                                    {item.questionsAndProducts &&
                                                                        item.questionsAndProducts.products[messageIndex] && (
                                                                            <Flex gap={2} mt={2}>
                                                                                {item.questionsAndProducts.products[
                                                                                    messageIndex
                                                                                ].products.map((product: any, productIndex: number) => (
                                                                                    <img
                                                                                        key={productIndex}
                                                                                        src={product.Image}
                                                                                        alt={product.ProductName}
                                                                                        onClick={() => openModal(product)}
                                                                                        style={{
                                                                                            width: '70px', // Adjust width as needed
                                                                                            height: '70px', // Adjust height as needed
                                                                                            borderRadius: '20%', // Makes the image round-cornered
                                                                                            border: "2px solid lightgray",
                                                                                            objectFit: 'scale-down', // Ensures the image covers the box size properly
                                                                                        }}
                                                                                    />
                                                                                ))}
                                                                            </Flex>
                                                                        )}
                                                                </Box>
                                                            ))}
                                                    </Flex>
                                                </>
                                            )}


                                        {/* Product Modal */}
                                        <Modal isOpen={!!selectedProduct} onClose={closeModal}>
                                            <ModalOverlay />
                                            <ModalContent mx="25px" borderRadius="md" boxShadow="lg" bg="white">
                                                <ModalHeader>
                                                    <Flex justifyContent="space-between" alignItems="center">
                                                        <Text fontSize="xl" fontWeight="bold" color="gray.700">
                                                            {selectedProduct?.ProductName}
                                                        </Text>
                                                        <ModalCloseButton />
                                                    </Flex>
                                                </ModalHeader>
                                                <ModalBody>
                                                    <img
                                                        src={selectedProduct?.Image}
                                                        alt={selectedProduct?.ProductName}
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            borderRadius: 'md',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                    <Text mt={2} fontSize="lg" color="gray.600">
                                                        {selectedProduct?.Brand}
                                                    </Text>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button
                                                        as="a" // Treat button as an anchor tag
                                                        href={selectedProduct?.Buy} // Open product link in a new tab
                                                        target="_blank"
                                                        colorScheme="blue"
                                                        mr={3}
                                                    >
                                                        Buy Now
                                                    </Button>
                                                </ModalFooter>
                                            </ModalContent>
                                        </Modal>
                                    </Box>
                                )}
                            </Flex>
                        ))}
                    </Flex>

                    {/* Chat Input (Fixed at Bottom) */}
                    <Box position="fixed" bottom="0" left="0" p={2} bg="white" width="100%" zIndex="1">

                        {/* Question Overlay */}
                        <Flex
                            flexDir="column"
                            position="absolute"
                            bottom="100%"
                            gap={2}
                            className="backdrop-blur-md"
                            width="fit-content"
                            zIndex="2"
                            
                            maxH={showQuestions ? "40vh" : "0"}
                            overflow="hidden"
                            transition="max-height 0.3s ease-in-out"
                            sx={{ transformOrigin: 'bottom' }}
                        >
                            {questions.map((question, index) => (
                                <Button
                                    key={index}
                                    onClick={() => {
                                        handleQuestionClick(question);
                                        setShowQuestions(false);
                                    }}
                                    bgColor="#C4EB5F" // Lighter green background
                                    fontSize="12px" // Smaller font size
                                    fontWeight="thin" // Thinner font weight
                                    textAlign="left"
                                    width="fit-content" // Fit content width
                                    rounded="xl"
                                    maxWidth="75vw" // Wrap at 75% screen width
                                    whiteSpace="normal" // Allow text wrapping
                                >
                                    {question}
                                </Button>
                            ))}
                        </Flex>
                        {showChat ? (
                            <InputGroup size="md" borderRadius="full">
                                {/* Suggestions Button */}
                                <IconButton
                                    aria-label={showQuestions ? "Hide Suggestions" : "Show Suggestions"}
                                    icon={showQuestions ? <ChevronDownIcon /> : <Sparkles />}
                                    onClick={() => setShowQuestions(!showQuestions)}
                                    mr={1} // Add margin for spacing
                                    borderRadius="full"
                                    bgColor="#C4EB5F" // Optional: match color theme
                                />
                                <Input
                                    value={newQuery}
                                    onChange={(e) => setNewQuery(e.target.value)}
                                    placeholder="Type your question..."
                                    borderRadius="full"
                                    focusBorderColor="#C4EB5F"
                                    mr={16}
                                />
                                <InputRightElement width="4.5rem" h="100%" display="flex" alignItems="center" justifyContent="center">
                                    <IconButton aria-label="Send message" icon={<ArrowUpIcon />} onClick={handleSend} borderRadius="full" bgColor="#C4EB5F" color="#485F0C" />
                                </InputRightElement>


                            </InputGroup>
                        ) : (
                            <Flex
                                flexDir="row"
                                alignItems="center" // Vertically center items
                                justifyContent="flex-start" // Justify to the left
                            >
                                <IconButton
                                    aria-label={showQuestions ? "Hide Suggestions" : "Show Suggestions"}
                                    icon={showQuestions ? <ChevronDownIcon /> : <Sparkles />}
                                    onClick={() => setShowQuestions(!showQuestions)}
                                    mr={1} // Add margin for spacing
                                    borderRadius="full"
                                    bgColor="#C4EB5F" // Optional: match color theme
                                />
                                <Button

                                    bgColor="#C4EB5F"
                                    color="#485F0C"
                                    rounded="full"
                                    onClick={handleContinueChat}
                                >
                                    Continue Chat with Coco
                                </Button>
                            </Flex>
                        )}
                    </Box>
                </div>



            </Flex>
            {/* File Upload Drawer */}
            <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
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
    );
}

export default function Page() {
    return (
        <Suspense>
            <OutfitReviewPage />
        </Suspense>
    )
}
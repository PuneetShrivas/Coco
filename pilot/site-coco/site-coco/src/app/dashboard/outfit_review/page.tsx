"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { ArrowLeft, Camera, Shirt, NotebookPen, ArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
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

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    isLoading?: boolean; // Add isLoading to track loading state of assistant messages
}

function OutfitReviewPage() {
    const searchParams = useSearchParams();
    var imageDataUrl = searchParams.get("imageDataUrl");
    const queryText = searchParams.get("queryText");
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
    const [isLoading, setIsLoading] = useState(false);
    const [apiCalled, setApiCalled] = useState(false);
    const [cocoResponse, setCocoResponse] = useState("Coco is looking at your outfit 🔎"); // Initial Coco response
    const router = useRouter();
    const [canGetCocoResponse, setCanGetCocoResponse]=useState(true);

    const toggleResponse = (index: number) => {
        setActiveResponseIndex(activeResponseIndex === index ? null : index);
        console.log("index",index);
        console.log("active index",activeResponseIndex);
    };

    const handleContinueChat = () => {
        setShowChat(true); // Show the chat input area
    };

    const handleSend = async () => {
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

    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
              const response = await fetch('https://api.ipify.org?format=json');
              const data = await response.json();
              setIpAddress(data.ip);
            } catch (error) {
              console.error("Error fetching IP address:", error);
            }
          };
      
          fetchIpAddress();
        mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_ID || "", { debug: true, track_pageview: true, persistence: 'localStorage' });
        mixpanel.track('outfit_review',{ $ip: ipAddress });
      });
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
                    )}&query=${encodeURIComponent(query)}&user_id=${encodeURIComponent(metaId??"")}&lat=${encodeURIComponent(lat)}&long=${encodeURIComponent(long)}`,
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
                    
                    // Update chat history with user query and assistant response
                    setChatHistory((prev) => [
                      ...prev.slice(0, -1), // Remove the last loading message
                      { role: "assistant", content: data.response.answer, isLoading: false },
                    ]);
                    console.log("prev:",activeResponseIndex)
                    setActiveResponseIndex(chatHistory.length+1);
                    console.log("setting to:",chatHistory.length+1)
                    console.log("now:",activeResponseIndex)
                  } else {
                    setChatHistory(prev => {
                        // Find the last assistant message and update it with the error
                        const updatedHistory = [...prev];
                        for (let i = updatedHistory.length - 1; i >= 0; i--) {
                            if (updatedHistory[i].role === "assistant") {
                                updatedHistory[i] = {
                                    role: "assistant",
                                    content: "There was an error processing the request",
                                    isLoading: false,
                                };
                                break;
                            }
                        }
                        return updatedHistory;
                    });
                }
            } catch (error) {
                console.error("Error getting outfit review:", error);
                setChatHistory(prev => {
                    // Find the last assistant message and update it with the error
                    const updatedHistory = [...prev];
                    for (let i = updatedHistory.length - 1; i >= 0; i--) {
                        if (updatedHistory[i].role === "assistant") {
                            updatedHistory[i] = {
                                role: "assistant",
                                content: "There was an error processing the request",
                                isLoading: false,
                            };
                            break;
                        }
                    }
                    return updatedHistory;
                });
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
        if(imageBlob){
        imageDataUrl=URL.createObjectURL(imageBlob)}
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
                                    src={imageDataUrl??""}
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

                {/* Dress Description */}
                {!isLoading && dressDescription && (
                    <div className="mx-4 h-[6vh] overflow-x-auto scrollbar-hide">
                        <Flex className="mb-1 mx-1 whitespace-nowrap " gap={2}>
                            {dressDescription
                                .split(/[,.;]\s*/)
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
                    </div>
                )}

                {/* Chat History (with Flex for scrolling) */}
                <div className="flex-grow mx-4 overflow-y-auto">
                    <Flex flexDir="column" gap={1} mb="10vh">
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
                                        onClick={() => toggleResponse(index)}
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
                                            {item.isLoading ? "Coco is thinking..." : cocoResponse}
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

                                        {/* Actionable Items */}
                                        {!item.isLoading &&
                                            item.content &&
                                            JSON.parse(item.content).some(
                                                (messageItem: any) => messageItem.tag === "actionable"
                                            ) && (
                                                <>
                                                    <Text mt={4} className={cn(lexendFont.className, "text-sm")}>
                                                        You can try the following:
                                                    </Text>
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
                                                                </Box>
                                                            ))}
                                                    </Flex>
                                                </>
                                            )}
                                    </Box>
                                )}
                            </Flex>
                        ))}
                    </Flex>

                    {/* Chat Input (Fixed at Bottom) */}
                    <Box position="fixed" bottom="0" left="0" p={4} bg="white" width="100%" z-index="1">
                        {showChat ? (
                            <InputGroup size="md" borderRadius="full">
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
                            <Button
                                mt={4}
                                mx="auto"
                                bgColor="#C4EB5F"
                                color="#485F0C"
                                rounded="full"
                                onClick={handleContinueChat}
                            >
                                Continue Chat with Coco
                            </Button>
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

export default function Page(){
    return(
        <Suspense>
            <OutfitReviewPage/>
        </Suspense>
    )
}
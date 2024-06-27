"use client";
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, Flex, Text, Spinner, Box, Heading, SimpleGrid, Tag, Divider, Icon, IconButton, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalCloseButton, ModalOverlay } from '@chakra-ui/react';
import { ChatMessage, UserChatSession } from '@prisma/client';
import {   cn } from '@nextui-org/react';
import { ArrowLeft, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { Lexend, Manrope } from 'next/font/google';
import { useRouter } from 'next/navigation'

const lexendFontSeven = Lexend({ weight: "700", subsets: ["latin"] });
const lexendFont = Lexend({ weight: "400", subsets: ["latin"] });
const manrope = Manrope({ weight: "400", subsets: ["latin"] });
interface Product {
  ProductName: string;
  Brand: string;
  Image: string;
  Buy: string;
}

interface ChatSessionViewProps {
    // Updated interface for session
    messages: ChatMessage[];
    date: string
    
  }

  const ChatSessionView: React.FC<ChatSessionViewProps> = ({ messages, date }) => {
    // Helper to extract and parse product questions
    const router = useRouter()
    const extractProductQuestions = (content: string | null) => {
      if (!content) return [];
      const parsedContent = JSON.parse(content);
      return parsedContent.questions.map((question: string) => question.slice(1, -1)); // Remove quotes
    };
    
    const [activeResponseIndex, setActiveResponseIndex] = useState<number | null>(1);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openModal = (product: Product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

  
    const toggleResponse = (index: number) => {
      setActiveResponseIndex(activeResponseIndex === index ? null : index);
  };
  
    return (
      <div className="bg-white h-[100vh] flex flex-col">
      <p className="bg-white mb-[8vh] text-white">-</p>
      <Flex flexDirection="column" className={lexendFontSeven.className}>
      <IconButton width="25px" aria-label="Go back" icon={<ArrowLeft />} rounded="full" mx="5vw" onClick={() => router.back()} />
        <Box p={2}>
        <Heading mx={6} as="h1" size="md"  mt={2}>
        {new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
</Heading>
          {/* Chat History (with Flex for scrolling) */}
          <div className="flex-grow mx-4 overflow-y-auto mb-[10vh]">
            <Flex flexDir="column" gap={1}>
              {messages.map((item, index) => (
                <Flex
                  key={index}
                  mt={index === 0 ? 4 : 2}
                  direction={item.sender === "user" ? "row-reverse" : "row"}
                  align="flex-start"
                >
                  {/* User message */}
                  {item.sender === "user" && (
                    <Text className={cn(lexendFontSeven.className, "text-[18px] ml-[3vw] text-purple-500")}>
                      {item.content}
                    </Text>
                  )}
  
                  {/* Assistant's Response */}
                  {item.sender === "assistant" && (
                    <Box
                      mt={2}
                      width="100%"
                      p={4}
                      bg="#e8eded"
                      borderRadius="xl"
                      className={`relative ${activeResponseIndex === index ? "" : "max-h-[50px] overflow-hidden"}`}
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
<Text
                                            mb={2}
                                            fontSize="16px"
                                            lineHeight="26px"
                                            fontWeight={400}
                                            className={lexendFont.className}
                                            color="#9ea0a3FF"
                                        >
                                            <Flex alignItems="center" flexDir="row">
                                                    Coco&apos;s Review
                                            </Flex>
                                        </Text>


                      {/* Coco's Response */}
                      <Text
                        mb={2}
                        fontSize="16px"
                        lineHeight="26px"
                        fontWeight={400}
                        className={lexendFont.className}
                      >
                        <Flex alignItems="center" flexDir="row">
                          {/* Outfit Review */}
                          {item.content &&
                            JSON.parse(item.content).map((messageItem: any, messageIndex: number) =>
                              messageItem.tag === "review" ? (
                                <Text
                                  key={messageIndex}
                                  className={cn(manrope.className, "text-sm")}
                                >
                                  {messageItem.content}
                                </Text>
                              ) : null
                            )}
                        </Flex>
                      </Text>
                      {/* Actionable Items with Product Images */}
                      {item.content &&
                        JSON.parse(item.content).some(
                          (messageItem: any) => messageItem.tag === "actionable"
                        ) && (
                          <>
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
                                    {item.productQuestions &&
                                      JSON.parse(item.productQuestions.toString()).products[messageIndex] && (
                                        <Flex gap={2} mt={2}>
                                          {JSON.parse(item.productQuestions.toString()).products[
                                            messageIndex
                                          ].products.map((product: Product, productIndex: number) => (
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
                    </Box>
                  )}
                </Flex>
              ))}
            </Flex>
          </div>
        </Box>
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
      </Flex>
      
    </div>
    );
  };
  
const ChatSessionPage = () => {
    const params = useParams();
    const sessionId = params.id;
    const [session, setSession] = useState<ChatSessionViewProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchChatSession = async () => {
        try {
          const response = await fetch(`/api/user/get_chat_sessions/get_chat/${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            setSession(data); // Set the session directly 
          } else {
            console.error('Failed to fetch chat session:', response.status);
          }
        } catch (error) {
          console.error('Error fetching chat session:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchChatSession();
    }, [sessionId]);
  
    return (
      <div>
        {isLoading ? (
             <div className="bg-white h-[100vh] flex flex-col">
      <p className="bg-white mb-[8vh] text-white">-</p>
          <Flex justifyContent="center" alignItems="center" h="200px">
            <Spinner size="xl" />
          </Flex>
          </div>
        ) : session ? (
          <ChatSessionView messages={session.messages} date={session.date}/> 
        ) : (
          <Text fontSize="lg">Chat session not found.</Text>
        )}
      </div>
    );
  };
  
  export default ChatSessionPage;
"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Key } from 'react';
import { ChatMessage, UserChatSession } from '@prisma/client';
import {
  Box, Flex, Text, Heading, Spinner,
  VStack, Button, HStack, Icon, Spacer, Image,
  IconButton
} from '@chakra-ui/react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Manrope, Lexend } from "next/font/google";
interface Product {
  ProductName: string;
  Brand: string;
  Image: string;
  Buy: string;
}

interface ChatSessionResponse {
  id: string;
  userId: string;
  messages: ChatMessage[];
  date: string;
}

const lexendFontSeven = Lexend({ weight: "700", subsets: ["latin"] });
const manrope = Manrope({ weight: '400', subsets: ["latin"] });

const UserChatHistoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id; // Get user ID from route parameters

  const [chatSessions, setChatSessions] = useState<ChatSessionResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        const response = await fetch(`/api/user/get_chat_sessions?dbUserId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setChatSessions(data.chatSessions);
        } else {
          console.error('Failed to fetch chat history:', response.status);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatSessions();
  }, [userId]);



   // Helper function to get excerpt from latest assistant message
   const getExcerpt = (messages: ChatMessage[]) => {
    const lastAssistantMessage = messages.findLast(msg => msg.sender === 'assistant' && msg.content);
    if (!lastAssistantMessage) return "View Chat";
    
    try {
        const parsedContent = JSON.parse(lastAssistantMessage.content);
        const reviewItem = parsedContent.find((item: any) => item.tag === 'review');
        const reviewContent = reviewItem?.content || '';

        // Extract the first few words (up to 3) from the reviewContent
        const words = reviewContent.split(/\s+/).slice(0, 3);
        return words.join(' ') + (words.length === 3 ? '...' : '');
    } catch (error) {
        console.error("Error parsing message content:", error);
        return "View Chat";
    }
};

  return (
    <div className="bg-white h-[100vh] flex flex-col">
      <p className="bg-white mb-[8vh] text-white">-</p>
      <IconButton width="25px" aria-label="Go back" icon={<ArrowLeft />} rounded="full" mx="5vw" onClick={() => router.back()} />

      <Box p={4} className={lexendFontSeven.className}>
        <Heading as="h1" size="xl" mb={4} color="purple.800">
          Chat History
        </Heading>

        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        ) : chatSessions?.length ? (
          <VStack spacing={4} align="stretch">
            {chatSessions.map(session => {
              const latestMessage = session.messages[session.messages.length - 1];
              const productImages = 
            typeof latestMessage.productQuestions === 'string' // Check if it's a string
              ? JSON.parse(latestMessage.productQuestions).products
                  .flatMap((category: any) => category.products)
                  .slice(0, 3)
                  .map((product: any) => product.Image)
              : []; // Fallback to empty array if not a string
              return (
                <Button
                  key={session.id}
                  variant="outline"
                  justifyContent="space-between"
                  onClick={() => router.push(`/dashboard/outfit_review/chat_session/${session.id}`)}
                  className={manrope.className}
                  px={6} // Increased padding for a more relaxed look
                  py={10}
                  borderRadius="2xl" // Well-rounded corners
                  bgColor="purple.50" // Example pastel purple background (adjust as needed)
                  _hover={{ bgColor: "purple.100" }} // Hover effect
                >
                  <Box textAlign="left"  width="60%">  {/* Box to align date and excerpt on the left */}
                    <Flex flexDir="row" alignItems="baseline" gap={2}>
                      <Text fontSize="xl" fontWeight="semibold">
                        {new Date(session.messages[0].timestamp).toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(session.messages[0].timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                    </Flex>
                    <Text fontSize="sm" mt={2}>
                      {getExcerpt(session.messages)}
                    </Text>
                  </Box>

                   {/* Image thumbnails on the right, stacked vertically */}
                <Flex flexDir="row" alignItems="flex-end"> 
                    {productImages.map((image: string | undefined, index: Key | null | undefined) => (
                        <Image
                            key={index}
                            src={image}
                            alt="Product"
                            boxSize="40px"
                            borderRadius="md"
                            objectFit="scale-down"
                            rounded="lg"
                            borderWidth="2px"
                            borderColor="gray.400"
                            mt={index === 0 ? 0 : 2} // Add margin-top to stack images
                        />
                    ))}
                </Flex>
                <Spacer />

                  <Icon as={ChevronRight} boxSize={5} />
                </Button>
              );
            })}
          </VStack>

        ) : (
          <Text fontSize="lg">No chat history found.</Text>
        )}
      </Box>
    </div>
  );
};

export default UserChatHistoryPage;

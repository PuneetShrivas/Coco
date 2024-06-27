import { Card, CardHeader, CardBody, CardFooter, Flex, Text, Divider, Heading, Link, Box } from '@chakra-ui/react';
import { Manrope } from 'next/font/google';
import { useRouter } from 'next/navigation';

const manropeFont = Manrope({ weight: '400', subsets: ['latin'] });

interface ChatSession {
  id: string;
  date: string;
  summary: string;
  messages: { role: "user" | "assistant"; content: string; products?: any[] }[]; // Messages with user/assistant roles and optional products
}

const ChatSessionCard = ({ session }: { session: ChatSession }) => {
  const router = useRouter();
  const formattedDate = new Date(session.date).toLocaleDateString(); // Format date

  return (
    <Card className={manropeFont.className}>
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Outfit Review - {formattedDate}</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>{session.summary}</Text>
        {/* Display messages with user/assistant distinction */}
        <Flex direction="column" my={4}>
          {session.messages.map((message, index) => (
            <Box key={index} my={2} className={message.role === 'user' ? 'user-message' : 'assistant-message'}>
              <Text fontWeight={message.role === 'assistant' ? 'bold' : 'normal'}>
                {message.role === 'assistant' ? 'Coco: ' : 'You: '} {message.content}
              </Text>
              {/* Display products if available (adjust as needed) */}
              {message.products && message.products?.length > 0 && (
                <>
                  <Divider my={2} />
                  <Heading size="sm" my={2}>Products:</Heading>
                  {message.products.map((product, idx) => (
                    <Text key={idx}>{product.name} - ${product.price}</Text> // Customize product display
                  ))}
                </>
              )}
            </Box>
          ))}
        </Flex>
      </CardBody>
      <CardFooter>
        <Flex justifyContent="flex-end">
          <Link onClick={() => router.push(`/dashboard/outfit_review/chat_session/${session.id}`)}>
            View Details
          </Link>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default ChatSessionCard;

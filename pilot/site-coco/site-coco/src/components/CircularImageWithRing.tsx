import { Image, Box, useColorModeValue } from '@chakra-ui/react';

interface CircularImageWithRingProps {
  src: any;
  alt: string;
  ringColor: string;
  ringSize?: number;
}

const CircularImageWithRing: React.FC<CircularImageWithRingProps> = ({
  src,
  alt,
  ringColor,
  ringSize = 4,
}) => {
  const ringInnerColor = useColorModeValue("white", "gray.800");

  return (
    <Box position="relative" w="128px" h="128px" borderRadius="full" overflow="hidden">
      {/* Image */}
      <Image
        src={src}
        alt={alt}
        boxSize="full"
        objectFit="cover"
        position="relative"
        zIndex={1} // Lower z-index for image
        borderRadius="full"
        bgColor={ringInnerColor}
      />
    </Box>
  );
};

export default CircularImageWithRing;


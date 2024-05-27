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
      {/* Ring */}
      {/* <Box
        position="absolute"
        top={ringSize / 9} // Adjust position to account for ringSize
        left={ringSize / 9} // Adjust position to account for ringSize
        right={ringSize / 9} // Adjust position to account for ringSize
        bottom={ringSize / 9} // Adjust position to account for ringSize
        borderWidth={`${ringSize}px`}
        borderStyle="solid"
        borderColor={ringColor}
        borderRadius="full"
        zIndex={2} // Higher z-index for ring
      /> */}
    </Box>
  );
};

export default CircularImageWithRing;


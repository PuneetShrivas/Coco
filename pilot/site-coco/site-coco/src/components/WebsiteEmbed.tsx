"use client"; // Add this for Client Components
import Iframe from 'react-iframe';

interface WebsiteEmbedProps {
  url: string;
  title?: string; // Provide a descriptive title for accessibility
  width?: string | number;
  height?: string | number;
  // Add more props from react-iframe documentation as needed
  // https://www.npmjs.com/package/react-iframe
}

const WebsiteEmbed = () => {
  return (
    <Iframe
      src='/Coco.html'
      url='/Coco.html'
      title={'Embedded Website'}
      width={'100%'}
    //   height={height || '500px'}
      styles={{ border: 'none' }} // Remove default border
      // Add other props here like:
      // - allow: For specifying allowed iframe features (e.g., fullscreen)
      // - position: 'absolute' | 'relative' (if needed for layout)
      // - display: 'initial' | 'block' | 'inline' | ... (for display options)
      // - ...and more, see the react-iframe documentation for details
    />
  );
};

export default WebsiteEmbed;

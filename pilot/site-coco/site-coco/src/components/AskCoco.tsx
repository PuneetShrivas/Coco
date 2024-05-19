import { Card, CardHeader, CardBody, CardFooter, Image } from '@nextui-org/react';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { Sparkles, Star } from 'lucide-react';
import { Glass_Antiqua, Work_Sans } from 'next/font/google';
const glassAntiquaFont = Glass_Antiqua({ weight: '400', subsets: ['latin'] })
const workSansFont = Work_Sans({ weight: '400', subsets: ['latin'] })
const AskCoco = ({
  user,
}: {
  user: KindeUser | null;
}) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const greeting = currentHour < 12 ? "Good Morning" : "Good Evening";

  return (
    <div className="mt-8 ml-4">
      <div className={glassAntiquaFont.className}>
      <h1 className="text-3xl font-semibold mb-1 dark:text-white font-display">
        {greeting}, <span className='gradient-text'>{user?.given_name}!</span>
      </h1>
      </div>
      <div className={workSansFont.className}>
      <p className="text-sm mb-6 dark:text-white tracking-tight">
        Are you styled for today? Let Coco help you!
      </p>
      </div>
      
        <Card className="w-11/12 md:w-3/4 lg:w-1/2">
          <CardBody className="flex gap-4">
            <div className='flex flex-row'>
              <div className="w-1/3 flex justify-center items-center">
                {/* Placeholder Image */}
                <div className="bg-gray-200 h-40 w-20 rounded-lg"></div>
              </div>

              <div className="w-1/2 flex flex-col ml-4 items-left justify-between">
                <div className={workSansFont.className}>
                <h2 className="text-large font-semibold dark:text-white">Ask Coco</h2>
                </div>

                <div className="flex flex-col gap-2 items-stretch">
                  {["Am I ready to go?", "Give me outfit ideas."].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="w-full justify-start bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-full flex items-center gap-2 border border-gray-300 dark:border-gray-600"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className='text-xs/[12px]'>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
  );
};

export default AskCoco;

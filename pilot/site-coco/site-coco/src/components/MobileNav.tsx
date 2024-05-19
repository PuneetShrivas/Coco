'use client'

import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types'
import { ArrowRight, Menu, User, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Flex } from '@chakra-ui/react'
import Image from 'next/image'
const MobileNav = ({ user, isAuth }: { user: KindeUser | null, isAuth: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false)

  const toggleOpen = () => setOpen((prev) => !prev)

  const pathname = usePathname()
  const imageUrl = user?.picture
  const name = user?.given_name
  useEffect(() => {
    if (isOpen) toggleOpen()
  }, [pathname])

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen()
    }
  }

  return (
    <div className='sm:hidden'>
      <Flex flexDir="row" height="100%" alignItems="center" className='z-50 relative'> {/* Add alignItems="center" to center vertically */}

        <Button className="rounded-full h-8 w-8 aspect-square bg-slate-400 border border-gray-200"> {/* Add border */}
          <Avatar className="relative w-8 h-8">
            {imageUrl ? (
              <div className="relative aspect-square h-full w-full">
                <Image fill src={imageUrl} alt="profile picture" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <User className="h-4 w-4 text-zinc-900" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>

        <ChevronDown
          onClick={toggleOpen}
          className="h-5 w-5 text-zinc-700 ml-2" // Add margin for spacing
        />

      </Flex>


      {isOpen ? (
        <div className='fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full'>
          <ul className='absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8'>
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() =>
                      closeOnCurrent('/sign-up')
                    }
                    className='flex items-center w-full font-semibold text-green-600'
                    href='/sign-up'>
                    Get started
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Link>
                </li>
                <li className='my-3 h-px w-full bg-gray-300' />
                <li>
                  <Link
                    onClick={() =>
                      closeOnCurrent('/sign-in')
                    }
                    className='flex items-center w-full font-semibold'
                    href='/sign-in'>
                    Sign in
                  </Link>
                </li>
                <li className='my-3 h-px w-full bg-gray-300' />
                <li>
                  <Link
                    onClick={() =>
                      closeOnCurrent('/pricing')
                    }
                    className='flex items-center w-full font-semibold'
                    href='/pricing'>
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() =>
                      closeOnCurrent('/dashboard')
                    }
                    className='flex items-center w-full font-semibold'
                    href='/dashboard'>
                    Dashboard
                  </Link>
                </li>
                <li className='my-3 h-px w-full bg-gray-300' />
                <li>
                  <Link
                    className='flex items-center w-full font-semibold'
                    href='/sign-out'>
                    Sign out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default MobileNav
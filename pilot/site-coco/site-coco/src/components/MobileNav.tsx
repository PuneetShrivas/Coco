'use client'

import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types'
import { AudioLines, ArrowRight, Menu, User, ChevronDown, ChevronUp, LayoutDashboard, LogOut, LogIn, UserCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CircleUser } from "lucide-react";
import { Button } from './ui/button'
import { Flex } from '@chakra-ui/react'
import {Spinner} from "@nextui-org/spinner";
import { LoginLink, RegisterLink, } from "@kinde-oss/kinde-auth-nextjs/components"
import { Manrope } from "next/font/google"
import Image from 'next/image'
import { cn } from '@/lib/utils'
const manrope = Manrope({ weight: '800', subsets: ["latin"] });

const MobileNav = ({ user, isAuth }: { user: KindeUser | null, isAuth: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const toggleOpen = () => setOpen((prev) => !prev)
  const pathname = usePathname()
  const imageUrl = user?.picture
  const name = user?.given_name
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isOpen) toggleOpen()
  }, [pathname])

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen()
    } else {
      console.log("starting spinner")
      setIsLoading(true);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <div className='sm:hidden'>
      <Flex flexDir="row" height="100%" alignItems="center" className='z-50 relative '> {/* Add alignItems="center" to center vertically */}
        <Link href={isAuth ? "/dashboard" : "/sign-in"}>
          <Button className='rounded-full h-10 w-24 bg-[#C4EB5F]  mx-2' variant='outline'>
            {/* <div>
              <AudioLines height={15} color='#383D41' />
            </div> */}
            <span className={cn(manrope.className, 'text-xs text-[14px] text-[#485F0C]')}> Get Pro </span>

          </Button>
        </Link>


        <Button className="rounded-full h-12 w-12 aspect-square bg-white align-middle items-center" variant="outline" style={{ borderRadius: '30px', overflow: 'hidden' }}> {/* Add border */}
          <Avatar className="relative w-12 h-12 align-middle items-center justify-center" onClick={toggleOpen}>
            {imageUrl ? (
              <div className="relative aspect-square h-full w-full">
                <Image fill src={imageUrl} alt="profile picture" referrerPolicy="no-referrer" layout='fill' objectFit='cover' />
              </div>
            ) : (
              <AvatarFallback >
                {/* <span className="sr-only">{name}</span> */}
                <User className="h-12 w-5 text-zinc-900" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
        {
          isOpen ? (
            <>
              <ChevronUp
                onClick={toggleOpen}
                className="h-5 w-5 ml-1" color='#dddfe0' // Add margin for spacing
              /></>

          ) : (
            <><ChevronDown
              onClick={toggleOpen}
              className="h-5 w-5 ml-1" color='#383D41' // Add margin for spacing
            /></>

          )}


      </Flex>


      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">

          {/* Refined Gradient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-700 via-black/40 to-transparent backdrop-blur-[2px] sm:backdrop-blur-[4px] md:backdrop-blur-[8px] transition-all duration-300"></div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <Spinner size='lg' color='secondary'/>
            </div>
          )}


          {/* Restyled Menu List */}
          <ul className="absolute right-10 top-20 flex flex-col items-end gap-2">
            {!isAuth ? (
              <>
                <li className='mt-[5px]'>
                  <Link
                    onClick={() => closeOnCurrent('/sign-up')}
                    className="bg-[#D2BEE0] rounded-full px-6 py-3 text-gray-800 shadow-md flex items-center font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
                    href="/sign-up"
                  >
                    Sign Up
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className='mt-[5px]'>
                  <Link
                    onClick={() => closeOnCurrent('/sign-in')}
                    className="bg-[#D2BEE0] rounded-full px-6 py-3 text-gray-800 shadow-md flex items-center font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
                    href="/sign-in"
                  >
                    Sign In
                    <LogIn className="ml-2 h-5 w-5" />
                  </Link>
                </li>
              </>
            ) : (
              <>
                
                <li className='mt-[5px]'>
                  <Link
                    onClick={() => closeOnCurrent('/dashboard')}
                    className="bg-[#D2BEE0] text-base rounded-full px-6 py-3 text-gray-800 shadow-md flex items-center font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
                    href="/dashboard"
                  >
                    Dashboard
                    <LayoutDashboard className="ml-2 h-5 w-5" />
                  </Link>
                </li>

                <li className='mt-[5px]'>
                  <Link
                    className="bg-[#D2BEE0] text-base rounded-full px-6 py-3 text-gray-800 shadow-md flex items-center font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
                    href="/sign-out"
                  >
                    Sign out
                    <LogOut className="ml-2 h-5 w-5" />
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
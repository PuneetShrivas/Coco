// import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
// import { Button } from "./ui/button"
// import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu"

// interface UserAccountNavPorps{
//     email: string | undefined
//     name: string
//     imageUrl: string
// }
// const UserAccountNav = async ({email,imageUrl,name}:UserAccountNavPorps) =>{
//     // const subscriptionPlan = await getUserSubscriptionPlan()'
//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild className="overflow-visible">
//                 <Button className=" rounder-full h-8 w-8 aspect-square bg-slate-400">
//                     <Avatar className="relative w-8 h-8">
//                         {
//                             imageUrl? (
//                                 <div className="relative aspect-square h-full w-full">
//                                     {/* <Image fill src={imageUrl} alt='profile picture' referrerPolicy='no-referrer'/> */}
//                                 </div>
//                             ) : <AvatarFallback>
//                                 <span className="sr-only">{name}</span>
//                                 {/* <Icons.user className="h-4 w-4 text-zinc-900"/> */}
//                             </AvatarFallback>
//                         }
//                     </Avatar>
//                 </Button>
//             </DropdownMenuTrigger>
//         </DropdownMenu>
//     )
// }

// export default UserAccountNav

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import OnboardingPage from "@/components/onboarding/OnBoardingPage";


const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const dbUser = await db.user.findFirst({
    where: { id: user?.id },
  });
  console.log(dbUser);
  

  if (dbUser?.isOnboarded) {
    console.log("user is already onboarded");
    redirect("/dashboard");
  }

  
  return (
    <div className="bg-white h-[100vh]">
      <OnboardingPage dbUser={dbUser} user={user}/>
    </div>
  );
};

export default Page;

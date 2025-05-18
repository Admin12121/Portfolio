import { cookies } from 'next/headers'
import Hlo_ from "./_components";


export default async function Home() {
  const cookieStore = await cookies();
  const animationCookie = cookieStore.get('showAnimation');
  const userCookie = animationCookie?.value === "false";

  return (
    <Hlo_ userCookie={userCookie}/>
  );
}

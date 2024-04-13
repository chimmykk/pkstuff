import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getSession} from "@/lib/lib";
import { redirect } from "next/navigation";


export default async function Home() {

  const session = await getSession()

  if (session){
    redirect('/admin')
  } else {
    return(
      <main className="flex flex-col gap-12 items-center pt-32 min-w-screen min-h-screen">
  <h1 className="text-3xl font-bold text-black mb-8 lg:mt-24 text-center leading-9">CLASS-STATS</h1>
  <div className="flex gap-4">
  <Link href={'/authentication'} className="border w-full">
    <Button size={'lg'} className="text-xl px-10 py-5 bg-soft-blue hover:bg-blue-700 transition-colors duration-300 ease-in-out">
      Admin
    </Button>
  </Link>
   <Link href={'/attendance-records'}>
    <Button variant={'outline'} size={'lg'} className="text-xl px-10 py-5  hover:bg-gray-100 text-black transition-colors duration-300 ease-in-out">
        Guest
    </Button>
   </Link>
  </div>
  <footer className="w-full mt-auto py-8 text-center bg-gray-100 text-gray-600">
    <Link href={'/about'} className=" hover:border-b hover:border-b-blue-500">About The Project</Link>
  </footer>
</main>

    
    )
  }
}

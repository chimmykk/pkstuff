
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "./components/admin-auth-form"
import { getSession } from "@/lib/lib"
import { redirect } from "next/navigation"
export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default async function AuthenticationPage() {

  const session = await getSession()

  if (session){
    redirect('/admin')
  }
  return (
    <>
      <div className="container relative flex-col py-12 items-center w-full justify-center ">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Admin Log in
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter admin Username & Password
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}
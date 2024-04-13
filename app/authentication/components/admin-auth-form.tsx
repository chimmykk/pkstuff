
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { redirect } from "next/navigation";
import { getSession, login, logout } from "@/lib/lib";
import Login from "./login"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {

  const action = async (formData: FormData) => {
    "use server"; 
    const loginSuccess = await login(formData);

    // if (loginSuccess) {
    //   redirect("/");
    // }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Login action={action}/>
    </div>
  );
}

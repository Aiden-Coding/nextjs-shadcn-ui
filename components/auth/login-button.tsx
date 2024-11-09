"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

interface ButtonSocialProps {
  children: React.ReactNode;
  provider: string;
}

const LoginBtn = ({ children, provider }: ButtonSocialProps) => {
  const handleClick = async () => {
    await signIn(provider);
  };

  return (
    <Button onClick={handleClick} variant="outline" className="w-full">
      {children}
    </Button>
  );
};
export default LoginBtn;

"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const LogoutBtn = () => {
  const handleClick = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return <Button onClick={handleClick}>LogOut</Button>;
};
export default LogoutBtn;

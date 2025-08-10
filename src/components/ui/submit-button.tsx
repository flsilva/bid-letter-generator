"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { BotMessageSquare } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="cursor-pointer w-64"
    >
      {pending ? (
        <div className="flex justify-center items-center">
          <div className="w-5 h-5 border-2 border-background border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <BotMessageSquare className="mr-2 h-5 w-5" />
          Generate Bid Letter
        </>
      )}
    </Button>
  );
}

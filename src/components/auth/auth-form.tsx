"use client";

import type { FormEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthFormProps = {
  children: ReactNode;
  className?: string;
};

export function AuthForm({ children, className }: AuthFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
    >
      {children}
    </form>
  );
}

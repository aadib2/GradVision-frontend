"use client";

import type { FormEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthFormProps = {
  children: ReactNode;
  className?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function AuthForm({ children, className, onSubmit }: AuthFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit?.(event);
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

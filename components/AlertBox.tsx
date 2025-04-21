"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, AlertTriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertBoxProps = {
  type: "success" | "error";
  title: string;
  description?: string;
};

export default function AlertBox({ type, title, description }: AlertBoxProps) {
  const isSuccess = type === "success";

  return (
    <Alert
      className={cn(
        "mt-4",
        isSuccess ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700"
      )}
    >
      {isSuccess ? <CheckCircle2Icon className="h-5 w-5" /> : <AlertTriangleIcon className="h-5 w-5" />}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleFirestoreError(error: any, operationType: string, path: string | null = null) {
  // Mocking the interface required by the integration instructions for consistency
  const errorInfo = {
    error: error.message || "Unknown firestore error",
    operationType,
    path,
    authInfo: {
      userId: "local-user", // In a real app with Firebase, this would be populated
      email: "guest@example.com",
      emailVerified: true,
      isAnonymous: false,
      providerInfo: [],
    },
  };
  console.error("Firestore Error:", JSON.stringify(errorInfo));
  throw new Error(JSON.stringify(errorInfo));
}

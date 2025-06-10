"use client";

import { useEffect } from "react";

export default function PiAuth() {
  useEffect(() => {
    const scopes = ["payments"];
    const onIncompletePaymentFound = (payment: any) => {
      console.log("Found incomplete payment:", payment);
    };

    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.authenticate(scopes, onIncompletePaymentFound)
        .then((auth: any) => {
          console.log("Hi there! You're ready to make payments!");
        })
        .catch((error: any) => {
          console.error("Authentication error:", error);
        });
    }
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

export default function PiPayment() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.createPayment(
        {
          amount: 3.14,
          memo: "Test payment from Yemeni Pi Market",
          metadata: { purpose: "test" },
        },
        {
          onReadyForServerApproval: function (paymentId: string) {
            console.log("Approve this payment on server:", paymentId);
          },
          onReadyForServerCompletion: function (paymentId: string, txid: string) {
            console.log("Complete this payment on server:", paymentId, txid);
          },
          onCancel: function (paymentId: string) {
            console.log("Payment cancelled:", paymentId);
          },
          onError: function (error: any, payment: any) {
            console.error("Payment error:", error, payment);
          },
        }
      );
    }
  }, []);

  return null;
}
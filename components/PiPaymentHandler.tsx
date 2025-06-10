```tsx
// components/PiPaymentHandler.tsx
import { useEffect } from 'react';

// Ensure Pi SDK is available
declare const Pi: any;

const PiPaymentHandler = () => {
  useEffect(() => {
    const scopes = ['payments'];

    function onIncompletePaymentFound(payment: any) {
      console.warn('Incomplete payment found:', payment);
    }

    Pi.authenticate(scopes, onIncompletePaymentFound)
      .then(auth => {
        console.log("Pi Network authenticated:", auth);
      })
      .catch(error => {
        console.error("Authentication failed:", error);
      });

    // Global event listener for any "Pay" button
    const handleClick = (e: any) => {
      if (e.target && e.target.matches('.pi-pay')) {
        Pi.createPayment({
          amount: 1,
          memo: "App payment",
          metadata: { source: "GlobalButton" }
        }, {
          onReadyForServerApproval(paymentId: string) {
            console.log("Ready for server approval:", paymentId);
          },
          onReadyForServerCompletion(paymentId: string, txid: string) {
            console.log("Payment complete:", paymentId, txid);
          },
          onCancel(paymentId: string) {
            console.warn("Payment cancelled:", paymentId);
          },
          onError(error: any, payment: any) {console.error("Payment error:", error, payment);
          }
        });
      }
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null; // No visible UI
};

export default PiPaymentHandler;

// Then import it in App.tsx or _app.tsx (Next.js)
```
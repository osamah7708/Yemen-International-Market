`\`\`tsx
import React from 'react';

// Pi SDK import
declare const Pi: any;

// Application wallet address
const WALLET_ADDRESS = 'SBKPNTILNAVS2CNPFX5QPQYYES4FDASYPY7URRYXF2R3NMZ4ES5P4N3U';

// Private seed — should be used only on the server (backend) and kept secret
const PRIVATE_SEED = 'era valid leave health viable erode sausage hill skull trend process wheat flight usage grape degree device hazard glow basket shuffle pair desk foster';

function AppToUserPayment() {

  // Function to create a payment to user
  const createPayment = async () => {
    try {
      const payment = await Pi.createPayment({
        amount: 5, // Amount of Pi to send
        memo: 'Thank you for using Yemeni International Market',
        metadata: { orderId: '123456' },
      }, {
        onReadyForServerApproval(paymentId: string) {
          console.log('Payment ready for server approval:', paymentId);
          // Send paymentId to your backend for approval using PRIVATE_SEED
        },
        onReadyForServerCompletion(paymentId: string, txid: string) {
          console.log('Payment completed:', paymentId, txid);
        },
        onCancel(paymentId: string) {
          console.log('Payment canceled:', paymentId);
        },
        onError(error: any, payment: any) {console.error('Payment error:', error, payment);
        }
      });
    } catch (err) {
      console.error('Failed to create payment:', err);
    }
  };

  return (
    <div>
      <button onClick={createPayment}>Pay Pi to User</button>
    </div>
  );
}

export default AppToUserPayment;
\`\`\`

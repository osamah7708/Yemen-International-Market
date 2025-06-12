const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const PI_API_KEY = 'vxhcs0iiebwsviqp0kx4xmhhoegk3gdthjtqj9v2kklu8kf2ivtqn0dr0l55y7ke';

router.post('/verify-pi-payment', async (req, res) => {
  const { paymentId, txid } = req.body;

  if (!paymentId) {
    return res.status(400).json({ success: false, message: 'paymentId is required' });
  }

  try {
    // 1. التحقق من صحة المعاملة عبر Pi API
    const verifyUrl = `https://api.minepi.com/v2/payments/${paymentId}`;
    const verifyResponse = await fetch(verifyUrl, {
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyData || verifyData.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'المعاملة غير مكتملة أو غير صحيحة', details: verifyData });
    }

    // 2. إكمال المعاملة (complete endpoint)
    const completeUrl = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
    const completeResponse = await fetch(completeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid }) // غالباً txid مطلوب هنا
    });
    const completeData = await completeResponse.json();

    if (!completeResponse.ok) {
      return res.status(400).json({ success: false, message: 'فشل إكمال المعاملة', details: completeData });
    }

    // نجاح التحقق والإكمال
    res.json({ success: true, verify: verifyData, complete: completeData });

  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ بالخادم', error: error.message });
  }
});

module.exports = router;
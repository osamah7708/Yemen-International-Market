const express = require('express');
const app = express();
const piPaymentRouter = require('./routes/piPayment');

app.use(express.json());
app.use('/api', piPaymentRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
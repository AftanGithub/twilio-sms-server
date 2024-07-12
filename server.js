const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require("dotenv").config();
const app = express();
const port = process.env.PORT;

// Replace these with your Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

app.use(bodyParser.json());

app.post('/send-sms', (req, res) => {
    const { phoneNumber, message } = req.body;

     // Regex to validate that phoneNumber contains only digits and +, and is between 10 and 15 characters long
     const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!phoneNumber || !message) {
        return res.status(400).send({ error: 'Phone number and message are required' });
    }

    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).send({ error: 'Invalid phone number format. Only digits and + are allowed.' });
    }

    client.messages
        .create({
            body: message,
            from: twilioPhoneNumber,
            to: phoneNumber,
        })
        .then((message) => {
            res.status(200).send({ success: true, message: 'SMS sent', sid: message.sid });
        })
        .catch((error) => {
            res.status(500).send({ success: false, error: error.message });
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const nodemailer = require('nodemailer');
async function sendEmail(receiverEmail,msg) {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use a service like Gmail
        auth: {
            user: 'vedantshelar871@gmail.com', // Your email 
            pass: process.env.EMAIL_APP_PASSWORD   // Your email password or app password
        }
    });

    // Email details
    const mailOptions = {
        from: 'vedantshelar871@gmail.com',
        to: receiverEmail,
        subject: 'SKILLHUB ADMIN ACCESS',
        text: msg,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;

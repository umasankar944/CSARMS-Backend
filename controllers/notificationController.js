import nodemailer from 'nodemailer';
import twilio from 'twilio';
import admin from 'firebase-admin';
import schedule from 'node-schedule';
import moment from 'moment-timezone';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hiteshreddy2181@gmail.com',
    pass: 'jgkanrwlquaxuitb'
  }
});

const client = twilio(accountSid, authToken);

export const notifications = async (req, res) => {
  try {
    console.log("Came to notificatios")
    const { name, description, scheduler, notification, source_id } = req.body;
    // Log the incoming schedule time 
    console.log(`Received schedule time from frontend: ${scheduler}`); 
    // Convert the scheduleTime to the correct timezone 
    const date = moment.tz(scheduler, 'Asia/Kolkata').toDate(); 
    // Adjust the timezone as needed 
    // Log the parsed date 
    console.log(`Scheduling notification for: ${date} to ${source_id}` );

    const sendNotification = () => {
        if (notification === 'email') 
            { const mailOptions = 
                { from: 'hiteshreddy2181@gmail.com', 
                to: source_id, 
                subject: `Reminder: ${name}`, 
                text: `
Hello, 

This is a friendly reminder for your task: ${name} 
${description} 
Please make sure to complete it on time. 

Thanks & Regards, 
Team CSARMS` };
          

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: "Error sending email", error: error.message, status: 500 });
          } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: "Email sent successfully",status: 200 });
          }
        });
      } else if (notification === 'phone') {
        client.messages.create({
          body: `Reminder: ${name}`,
          from: source_id, // Your Twilio phone number
          to: source_id //Recipient's phone number
        }).then(message => {
          console.log('SMS sent:', message.sid);
          return res.status(200).json({ message: "SMS sent successfully",status: 200 });
        }).catch(error => {
          console.error('Error sending SMS:', error);
          return res.status(500).json({ message: "Error sending SMS",status: 500 });
        });
      } else if (notification === 'push') {
        console.log('Push Notification sent');
        return res.status(200).json({ message: "Push Notification sent successfully",status: 200 });
       }
     };

    schedule.scheduleJob(date, sendNotification);
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return res.status(500).json({ message: "Internal server error",status: 500 });
  }
};

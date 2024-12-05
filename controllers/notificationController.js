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
    pass: 'dbzeoahbpmjkatqn'
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
            res.status(500).send('Error sending email');
          } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
          }
        });
      } else if (notification === 'phone') {
        client.messages.create({
          body: `Reminder: ${name}`,
          from: '+14439988811', // Your Twilio phone number
          to: '+91 9390787290' //Recipient's phone number
        }).then(message => {
          console.log('SMS sent:', message.sid);
          res.status(200).send('SMS sent successfully');
        }).catch(error => {
          console.error('Error sending SMS:', error);
          res.status(500).send('Error sending SMS');
        });
    //   } else if (notification === 'push') {
    //     const message = {
    //         NOTIFICATION: {
    //         title: `Reminder: ${name}`,
    //         body: `This is a reminder for your task: ${description}`
    //       },
    //       token: 'recipient_device_token' // Replace with the recipient's device token
    //     };

    //     admin.messaging().send(message)
    //       .then(response => {
    //         console.log('Push notification sent:', response);
    //         res.status(200).send('Push notification sent successfully');
    //       })
    //       .catch(error => {
    //         console.error('Error sending push notification:', error);
    //         res.status(500).send('Error sending push notification');
    //       });
       }
     };

    schedule.scheduleJob(date, sendNotification);
  } catch (error) {
    console.error('Error scheduling notification:', error);
    res.status(500).send('Internal server error');
  }
};

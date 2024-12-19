import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken';
import { formatDate } from '../utils/dateFormatter.js';
import formatPrice from '../utils/formatPrice.js';

export const sendVerificationCode = async (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const code = Math.floor(100000 + Math.random() * 900000);
      await transporter.sendMail({
          from: "cloudpeak.airlines",
          to: `${email}`,
          subject: "Cloud Peak Airlines Verification Code",
          text: `Your Verification Code is ${code}`,
      });
      
      const verificationCode = jwt.sign({code}, process.env.JWT_SECRET, {
        expiresIn: 30000
      });

      return verificationCode;
}

export const sendTickets = async (email, booking, line_items) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "CloudPeakAirlines@gmail.com",
    to: email,
    subject: "Flight Itinerary",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Flight Ticket</title>
      </head>
      <body style="margin: 0; padding: 0px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="background-color: white; padding: 20px">  
        <div style="width: 100vw; background: linear-gradient(to right, #ff5b32, #ff3131); color: white; text-allign: end; padding: 10px; font-weight: 600; font-size: 17px;">
          CLOUDPEAK AIRLINES
        </div>
        <h1>Your Itinerary</h1>
        <p style="font-size: 17px;">Booking Reference: ${booking.booking_ref}</p>
        <p style="margin: 30px 0 10px 0; font-size: 17px;">Click the link below to view your flight ticket:</p>
        <a href="https://cloudpeakairlines.onrender.com/tickets?data=${booking._id}" style="color: #ff3131; font-size: 17px; text-decoration: underline">https://cloudpeakairlines.onrender.com</a>
        <table width="100%" style="margin: 50px 0 30px 0; background-color: white;">
            <thead>
              <tr>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Flight</th>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Airline</th>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Departure</th>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Arrival</th>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Class</th>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Fare Type</th>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Airplane Code</th>
              </tr>
            </thead>
            <tbody>
              ${booking.flights.map(flight => `
                <tr>
                  <td style="padding: 10px; text-align: center;">${flight.flightNumber}</td>
                  <td style="padding: 10px; text-align: center;">${flight.airline}</td>
                  <td style="padding: 10px; text-align: center;">${flight.departure.airport}-${flight.departure.country} ${formatDate(flight.departure.time)}</td>
                  <td style="padding: 10px; text-align: center;">${flight.arrival.airport}-${flight.arrival.country} ${formatDate(flight.arrival.time)}</td>
                  <td style="padding: 10px; text-align: center;">${booking.class}</td>
                  <td style="padding: 10px; text-align: center;">${booking.fareType}</td>
                  <td style="padding: 10px; text-align: center;">${flight.airplane}</td>
                </tr>`).join('')}
            </tbody>
          </table>
                
          <table width="100%" style="margin-bottom: 30px; background-color: white;">
            <thead>
              <tr>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Passenger Name</th>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Passenger Type</th>
              </tr>
            </thead>
            <tbody>
              ${booking.flights[0].passengers.map(passenger => `
                <tr>
                  <td style="padding: 10px; text-align: center;">${passenger.firstname} ${passenger.lastname}</td>
                  <td style="padding: 10px; text-align: center;">${passenger.type}</td>
                  <td style="padding: 10px; text-align: center;">${passenger.seatNumber}</td>
                </tr>`).join('')}
            </tbody>
          </table>
          <table width="100%" style="margin-bottom: 30px; background-color: white;">
            <thead>
              <tr>
                <th style="width: 50vw; background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Purchase Description</th>
                <th style="background-color: #ff3131; color: white; padding: 10px; font-size: 15px; font-weight: 400;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${line_items.map(item => `
                <tr>
                  <td style="padding: 10px; text-align: center;">${item.name}</td>
                  <td style="padding: 10px; text-align: center;">${formatPrice(item.amount * item.quantity)}</td>
                </tr>`).join('')}
              <tr>
                <td style="padding: 10px; text-align: center;">Total</td>
                <td style="padding: 10px; text-align: center;">${formatPrice(line_items.reduce((total, item) => (item.amount * item.quantity) + total, 0))}</td>
              </tr>
            </tbody>
          </table>
          </div>
      </body>
      </html>
    `,
  });
};

export const sendNewAdminInfo= async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: "CloudPeakAirlines@gmail.com", 
    to: `${data.email}`, 
    subject: "New Admin",
    html: `
        <p>New Admin Information:</p>
        <p>Employee Id: ${data.employeeId}</p>
        <p>Email: ${data.email}</p>
        <p>Firstname: ${data.firstname}</p>
        <p>Lastname: ${data.lastname}</p>
        <p>Password: ${data.password}</p>
    `
});
}

export const sendNewFrontDeskInfo= async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: "CloudPeakAirlines@gmail.com", 
    to: `${data.email}`, 
    subject: "New Front Desk Agent",
    html: `
        <p>New Front Desk Agent Information:</p>
        <p>Employee Id: ${data.employeeId}</p>
        <p>Email: ${data.email}</p>
        <p>Firstname: ${data.firstname}</p>
        <p>Lastname: ${data.lastname}</p>
        <p>Password: ${data.password}</p>
    `
});
}
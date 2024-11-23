import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken';
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
          from: "tcu.airlines",
          to: `${email}`,
          subject: "Verification Code",
          text: `Your Verification Code is ${code}`,
      });
      
      const verificationCode = jwt.sign({code}, process.env.JWT_SECRET, {
        expiresIn: 30000
      });

      return verificationCode;
}

export const sendTickets = async (email, id) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: "CloudPeakAirlines@gmail.com", 
      to: `${email}`, 
      subject: "Flight ticket",
      html: `
          <p>Click the link below to view your flight ticket:</p>
          <a href="https://cloudpeakairlines.onrender.com/tickets?data=${id}" style="text-decoration: underline;">
              https://cloudpeakairlines.onrender.com/tickets
          </a>
      `
  });
}


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
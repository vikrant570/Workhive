import OTP from "../models/auth/otpsModel";
import otpGen from "otp-generator";
import nodemailer from "nodemailer";

// FUNCTION TO SEND OTPs
export const sendOtp = async (email: string) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process?.env.SMTP_EMAIL,
      pass: process?.env.SMTP_PASS,
    },
  });

  // Generate OTP to send
  const otp = otpGen.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // Save the otp in DB
  try {
    await OTP.create({
      user: email,
      otp: otp,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return { success: false, code: 11000 };
    }
  }

  //Email For Sending OTP
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email, //recievd at frontend
    subject: "Verification Request.",
    html:
      `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Email - WorkHive</title>
                <style>
                    /* Email client resets */
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; }
                    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #121424; }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #121424; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121424; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #1D2034; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                                
                                <tr>
                                    <td align="center" style="padding: 40px 40px 20px 40px;">
                                        <h3 style="margin: 0; color: #F4F6F6; font-size: 22px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                                            WorkHive
                                        </h3>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="left" style="padding: 0 40px 30px 40px;">
                                        <p style="margin: 0 0 15px 0; color: #F4F6F6; font-size: 16px; line-height: 1.6;">
                                            Hello,
                                        </p>
                                        <p style="margin: 0 0 30px 0; color: #F4F6F6; font-size: 16px; line-height: 1.6;">
                                            We received a request to verify your email address. Please use the One-Time Password (OTP) below to complete your verification process.
                                        </p>

                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td align="center" style="background-color: #121424; border: 1px solid rgba(81, 162, 255, 0.2); border-radius: 12px; padding: 30px;">
                                                    <h1 style="margin: 0; color: #51A2FF; font-size: 42px; font-weight: 700; letter-spacing: 8px;">
                                                        ${otp}
                                                    </h1>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin: 30px 0 0 0; color: #AAB7B8; font-size: 14px; line-height: 1.6;">
                                            <strong style="color: #F4F6F6;">Security Notice:</strong> For your protection, please do not share this code with anyone, including WorkHive personnel. This code will expire in 5 minutes.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding: 30px 40px; background-color: #161829; border-top: 1px solid #2A2D43;">
                                        <p style="margin: 0; color: #AAB7B8; font-size: 13px; line-height: 1.5;">
                                            Didn't request this code? 
                                            <br>
                                            Please report it immediately to <a href="mailto:support@workhive.com" style="color: #51A2FF; text-decoration: none; font-weight: 600;">support@workhive.com</a>
                                        </p>
                                    </td>
                                </tr>
                                
                            </table>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" style="padding: 20px 0; color: #7A8788; font-size: 12px;">
                                        &copy; 2026 WorkHive. All rights reserved.
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>`,
  };

  //Send the mail finally using our transport
  try {
    await transport.sendMail(mailOptions);
    return { success: true, code: 10000 }
  } catch (err) {
    return { success: true, code: 11111 }
  }
};

// Mail after an authentication
export const sendFinalMail = async (
  fullname: string,
  email: string,
  action: string
) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process?.env.SMTP_EMAIL,
      pass: process?.env.SMTP_PASS,
    },
  });

  const text: string =
    action == "register"
      ? `Welcome ${fullname}! \n Thank you for choosing our platform.`
      : `Hey ${fullname}, \nSomeone recently logged in to your account. Report at support@wokhive.com if its not you.`;

  //Email content
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email, //recievd from frontend
    subject: "Verification Request.",
    text: text,
  };

  //Welcome Mail sent
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err.message);
      return;
    }
  });
};

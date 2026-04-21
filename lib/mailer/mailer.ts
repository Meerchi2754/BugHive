"use server";

import { addVerifier } from "@/app/actions/claims/addVerifier";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
const transportOptions: SMTPTransport.Options = {
  host: "smtp.gmail.com",
  secure: false,
  port: Number(process.env.SMTP_PORT!),
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!,
  },
};
const transporter = nodemailer.createTransport(transportOptions);

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo: string;
  subject: string;
  text: string;
  html: string;
}) {
  try {
    const isVerified = await transporter.verify();
    const info = await transporter.sendMail({
      from: email,
      to: sendTo,
      subject: subject,
      text: text,
      html: html ?? "",
    });
    //console.log("INFO:", info);
    console.log("Message Sent", info.messageId);
    console.log(`Mail sent to ${sendTo}`);
    return info;
  } catch (error) {
    console.log("Something went Wrong.", error);
    return;
  }
}

import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM_ADDRESS = "NexBuy <onboarding@resend.dev>";
export const APP_URL = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");

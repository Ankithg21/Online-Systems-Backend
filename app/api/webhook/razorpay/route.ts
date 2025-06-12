import { connectDB } from "@/lib/connectdb";
import Order from "@/models/Order.model";
import crypto from "crypto";
import nodemailer from "nodemailer"

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-razorpay-signature");
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!signature || !secret) {
            return new Response("Signature or secret missing", { status: 400 });
        }

        // Verify the signature
        const expectedSignature = crypto.createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        // Compare the received signature with the expected signature    
        if (signature !== expectedSignature) {
            return new Response("Invalid signature", { status: 400 });
        }

        const event = JSON.parse(body);
        await connectDB();
        // Handle the event based on its type
        if(event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            // Process the payment details, e.g., save to database
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: payment.order_id },
                {
                    razorPaymentId: payment.id,
                    status: "paid",
                }
            ).populate([
                {path: "productId", select: "name"},
                {path: "userId", select: "email"}
            ])
            
            if (!order) {
                return new Response("Order not found", { status: 404 });
            }

            // Send email notification
            const transporter = nodemailer.createTransport({
                service: process.env.MAIL_HOST!,
                port: parseInt(process.env.MAIL_PORT || "587"),
                auth: {
                    user: process.env.EMAIL_USER!,
                    pass: process.env.EMAIL_PASSWORD!,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM!,
                to: order.userId.email,
                subject: "Order Successful",
                text: `Your order for ${order.productId.name} has been successfully placed. Your payment ID is ${payment.id}. Thank you for your purchase!`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.error("Error sending email:", error);
                }
                console.log("Email sent:", info.response);
            });

            return new Response("Payment processed successfully", { status: 200 });
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
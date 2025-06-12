import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/connectdb";
import Order from "@/models/Order.model";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "", 
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId, varient } = await request.json();

        if (!productId || !varient) {
            return NextResponse.json({ error: "Product ID and variant are required" }, { status: 400 });
        }

        await connectDB();
        // Validate productId and varient
        const options = await razorpay.orders.create({
            amount: (varient.price * 100), // Amount in paise
            currency: "USD",
            receipt: `receipt-${Date.now()}`,
            notes: {
                productId: productId.toString(),
                variant: varient,
                userId: session.user?.id?.toString(), // Assuming session.user.id contains the user's ID
            }
        });

        if (!options) {
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        // Create the order in the database-Update the Order model in DB.
        const newOrder = await Order.create({
            userId: session.user?.id,
            productId,
            variants: varient,
            razorpayOrderId: options.id,
            amount: Math.round(varient.price * 100),
            status: "pending",
        });

        if (!newOrder) {
            return NextResponse.json({ error: "Failed to create order in database" }, { status: 500 });
        }

        return NextResponse.json(newOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
};
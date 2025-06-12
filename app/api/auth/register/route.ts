import { connectDB } from "@/lib/connectdb";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({
            error: "Email and password are required"
        }, {
            status: 400
        });
    }

    try {
        await connectDB();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                error: "User already exists"
            }, {
                status: 409
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return NextResponse.json({
                error: "Password hashing failed"
            }, {
                status: 500
            });
        }
        await User.create({
            email,
            password: hashedPassword,
            role: "user" // Default role, can be changed as needed
        });

        return NextResponse.json({
            message: "User registered successfully"
        }, {
            status: 201
        });
    } catch (error: any) {
        console.error("Error during registration:", error.message);
        return NextResponse.json({
            error: "Registration failed"
        }, {
            status: 500
        });
    }
}

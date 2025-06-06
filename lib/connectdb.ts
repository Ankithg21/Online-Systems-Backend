import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;
if(!MONGO_URL){
    throw new Error("Please set up the env Credentials for MongoDB url.")
}

type connectionObject={
    isConnected?: boolean
};

const connection: connectionObject = {};

export async function connectDB(){
    if(connection.isConnected){
        console.log("Database already connected.");
        return;
    }

    try {
        const db = await mongoose.connect(MONGO_URL!);
        connection.isConnected = db.connections[0].readyState === 1;
        console.log("Database connection successful.");
        return;
    } catch (error: any) {
        console.log("Error in Database connection: ", error.message);
        throw new Error("Failed to connect Database.");
    }
}
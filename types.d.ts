import { Connection } from "mongoose";

declare global{
    const mongoose: {
        con: Connection | null,
        promise: Promise<Connection> | null
    }
}

export {};
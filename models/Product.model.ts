import mongoose from "mongoose";

export interface Variant{
    type: string;
    price: number;
    license: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductInterface{
    name: string;
    description: string;
    imageUrl: string;
    variants: Variant;
    createdAt?: Date;
    updatedAt?: Date;
}

const imageVarientSchema = new mongoose.Schema<Variant>({
    type:{
        type: String,
        required: true,
        enum: ["SQUARE", "PORTRAIT", "WIDE"],
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    license: {
        type: String,
        required: true,
        enum: ["Personal", "Commercial"],
    }
});

const productSchema = new mongoose.Schema<ProductInterface>({
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    variants: [
        imageVarientSchema
    ],
}, {timestamps: true});

const Product = mongoose.models?.Product || mongoose.model<ProductInterface>("Product", productSchema);
export default Product;
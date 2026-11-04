import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        verified: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const usermodel = mongoose.model("user", userSchema);

export default usermodel;

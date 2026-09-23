import bcrypt from "bcrypt";
import User from "../models/User.js";

const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

const registerUser = async ({ name, email, password }) => {

    if (!name || name.trim().length < 2 || name.trim().length > 100) {
        const error = new Error("Name must be between 2 and 100 characters");
        error.statusCode = 400;
        throw error;
    }

    if (!email || !isValidEmail(email.trim())) {
        const error = new Error("Please provide a valid email");
        error.statusCode = 400;
        throw error;
    }

    if (!password || password.length < 8) {
        const error = new Error("Password must be at least 8 characters");
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        const error = new Error("User with this email already exists");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
};

export default {
  registerUser,
};
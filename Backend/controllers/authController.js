import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendEmail.js";

// const generateToken = (id) => {
//     return jwt.sign(
//         { id },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRES_IN }
//     );
// };

const generateToken = (id) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    console.log("Generated Token:", token);

    return token;
};

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpire: Date.now() + 10 * 60 * 1000,
        });

        const message = `${newUser.name}, your OTP is: ${otp}`;

        await sendMail(email, "OTP Verification", message);

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role, 
            token: generateToken(newUser._id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
};
// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// LOGOUT (JWT frontend handled)
const getUsers = async (req, res) => {
    
    try {
       const users = await User.find({}).select("-password");
        res.json(users);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export { registerUser, loginUser, getUsers };
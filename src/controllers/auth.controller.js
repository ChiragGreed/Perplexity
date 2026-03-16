import userModel from "../models/userModel.js";


export const registerController = async (req, res) => {
    const { username, email, password } = req.body;

    const userExist = await userModel.findOne({ $or: [{ username }, { email }] });

    if (userExist) return res.status(400).json({
        message: "User with this " + (user.username == username) ? "username" : "email" + " already exist",
        success: false,
        err: "User already exist"
    })

    const user = await userModel.create({ username, email, password });

}



export default { registerController }

import userModel from "../models/userModel.js";
import sendEmail from "../services/emailService.js";
import JWT from 'jsonwebtoken'


export const register = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        const userExist = await userModel.findOne({ $or: [{ username }, { email }] });

        if (userExist) return res.status(400).json({
            message: "User with this " + (userExist.username === username ? "username" : "email") + " already exists",
            success: false,
            err: "User already exist"
        })


        const user = await userModel.create({ username, email, password })

        const token = JWT.sign({
            userid: user._id
        }, process.env.JWT_SECRET,
            { expiresIn: '1d' });


        const emailHtml = `
<div style="max-width:480px; margin:0 auto; padding:32px; background-color:#0e0e1c; border-radius:12px; font-family:Georgia,serif; text-align:center;">
  <h2 style="color:#e8e8f5; font-weight:300; margin-bottom:12px;">Welcome to Perplexity</h2>
  <p style="color:#7a7a9a; font-size:15px; line-height:1.7; margin-bottom:28px;">
    Click the button below to verify your account.
  </p>
  <a href="http://localhost:7000/api/auth/verifyRegister?token=${token}" style="display:inline-block; background:linear-gradient(135deg,#20DDAD,#1a9fff); color:#07070f; text-decoration:none; padding:12px 32px; border-radius:50px; font-size:13px; font-family:monospace; letter-spacing:1px;">
    Verify My Account
  </a>
  <p style="color:#3e3e58; font-size:12px; margin-top:24px;">
    If you didn't sign up, ignore this email.
  </p>
</div>`

        await sendEmail(
            email,
            'Verify registration',
            emailHtml
        )

        return res.status(200).json({
            message: `Email sent to ${email}`
        })

    } catch (err) {
        return res.status(500).json({ message: err.message, success: false })
    }
}

const verifyRegister = async (req, res) => {

    try {
        const { token } = req.query;

        const decodedToken = JWT.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) return res.status(400).json({
            message: "Invalid token",
            success: false,
            err: "Decoded token error"
        })

        const user = await userModel.findByIdAndUpdate(decodedToken.userid, {
            verified: true
        });


        if (!user) return res.status(404).json({
            messageL: "User not found",
            success: false,
            err: err
        })

        const verifiedPageHtml = ` <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verified</title>
  </head>
  <body style="margin:0; background:#07070f; display:flex; align-items:center; justify-content:center; min-height:100vh;">
    <div style="max-width:420px; width:100%; text-align:center; font-family:Georgia,serif; background:#0e0e1c; padding:40px; border-radius:12px; border:1px solid #1f1f35;">
      <div style="font-size:40px; margin-bottom:16px;">✦</div>
      <h2 style="color:#20DDAD; font-weight:300; margin:0 0 12px;">Account Verified!</h2>
      <p style="color:#7a7a9a; font-size:15px; line-height:1.7; margin:0 0 28px;">
        Your Perplexity account is now active and ready to go.
      </p>
      <a href="http://localhost:7000/api/auth/login" style="display:inline-block; background:linear-gradient(135deg,#20DDAD,#1a9fff); color:#07070f; text-decoration:none; padding:12px 32px; border-radius:50px; font-size:13px; font-family:monospace; letter-spacing:1px;">
        Go to Login
      </a>
    </div>
  </body>
  </html>`

        res.send(verifiedPageHtml)

        return res.status(200).json({
            message: "User Registered",
            success: true
        })
    }
    catch (err) {
        return res.status(400).json({ message: "Invalid or expired token", success: false, err: err.message });

    }
}



export default { register, verifyRegister }

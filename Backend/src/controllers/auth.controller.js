import userModel from "../models/userModel.js";
import sendEmail from "../services/emailService.js";
import JWT from 'jsonwebtoken'
import bcrypt from "bcryptjs";


const register = async (req, res) => {
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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your AskBase account</title>
</head>
<body style="margin:0; padding:0; background-color:#0A0A0A; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A; padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#111111; border-radius:16px; border:1px solid #27272A; overflow:hidden; max-width:480px; width:100%;">

          <!-- Header accent line -->
          <tr>
            <td style="background:linear-gradient(90deg,#F5FF3A,#ABD600); height:3px; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px; text-align:center;">

              <!-- Logo / wordmark -->
              <p style="margin:0 0 28px; font-size:22px; font-weight:700; letter-spacing:-0.5px; color:#FFFFFF;">AskBase</p>

              <!-- Title -->
              <h1 style="margin:0 0 12px; font-size:20px; font-weight:600; color:#FFFFFF; letter-spacing:-0.3px;">Verify your email address</h1>

              <!-- Body copy -->
              <p style="margin:0 0 32px; font-size:14px; line-height:1.7; color:#888887;">
                Thanks for signing up! Click the button below to confirm your email and activate your AskBase account.
              </p>

              <!-- CTA button -->
              <a href="https://askbase-qv8j.onrender.com/api/auth/verifyRegister?token=${token}"
                 style="display:inline-block; background:linear-gradient(90deg,#F5FF3A,#ABD600); color:#0A0A0A; text-decoration:none; padding:13px 36px; border-radius:12px; font-size:14px; font-weight:700; letter-spacing:0.2px;">
                Verify My Account
              </a>

              <!-- Fine print -->
              <p style="margin:28px 0 0; font-size:12px; color:#3c3c3c; line-height:1.6;">
                If you didn&rsquo;t create an AskBase account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px; border-top:1px solid #1f1f1f; text-align:center;">
              <p style="margin:0; font-size:11px; color:#3c3c3c;">&copy; 2025 AskBase. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

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

const resendEmail = async (req, res) => {

    const { username } = req.body;

    const user = await userModel.findOne({ username });

    if (!user) return res.status(404).json({
        message: "Please Register first",
        success: false,
        err: "User not found in database"
    })

    if (user.verified) return res.status(200).json({
        message: "User already verified",
        success: true,
    })

    try {
        const token = JWT.sign({
            userid: user._id
        }, process.env.JWT_SECRET,
            { expiresIn: '1d' });


        const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your AskBase account</title>
</head>
<body style="margin:0; padding:0; background-color:#0A0A0A; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A; padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#111111; border-radius:16px; border:1px solid #27272A; overflow:hidden; max-width:480px; width:100%;">

          <!-- Header accent line -->
          <tr>
            <td style="background:linear-gradient(90deg,#F5FF3A,#ABD600); height:3px; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px; text-align:center;">

              <!-- Logo / wordmark -->
              <p style="margin:0 0 28px; font-size:22px; font-weight:700; letter-spacing:-0.5px; color:#FFFFFF;">AskBase</p>

              <!-- Title -->
              <h1 style="margin:0 0 12px; font-size:20px; font-weight:600; color:#FFFFFF; letter-spacing:-0.3px;">Verify your email address</h1>

              <!-- Body copy -->
              <p style="margin:0 0 32px; font-size:14px; line-height:1.7; color:#888887;">
                We received a request to resend your verification email. Click the button below to confirm your email and activate your AskBase account.
              </p>

              <!-- CTA button -->
              <a href="https://askbase-qv8j.onrender.com/api/auth/verifyRegister?token=${token}"
                 style="display:inline-block; background:linear-gradient(90deg,#F5FF3A,#ABD600); color:#0A0A0A; text-decoration:none; padding:13px 36px; border-radius:12px; font-size:14px; font-weight:700; letter-spacing:0.2px;">
                Verify My Account
              </a>

              <!-- Fine print -->
              <p style="margin:28px 0 0; font-size:12px; color:#3c3c3c; line-height:1.6;">
                If you didn&rsquo;t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px; border-top:1px solid #1f1f1f; text-align:center;">
              <p style="margin:0; font-size:11px; color:#3c3c3c;">&copy; 2025 AskBase. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

        await sendEmail(
            user.email,
            'Verify registration',
            emailHtml
        )

        return res.status(200).json({
            message: `Email Resent to ${user.email}`
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Error re sending email",
            success: false,
            err: "Error re-sending email"
        })
    }


}

const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) return res.status(404).json({
        message: "Invalid password or username",
        success: false,
        err: "User not found with given username"
    })


    if (!user.verified) return res.status(400).json({
        message: "User not verified",
        success: false,
        err: "User not verified"
    })

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log(password, user.password);

    if (!passwordMatch) return res.status(400).json({
        message: "Invalid password or username",
        success: false,
        err: "Password did not match"
    })

    const token = JWT.sign({
        userid: user._id,
        username: user.username
    },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )



    res.cookie('token', token);

    res.status(200).json({
        message: "User logged in",
        success: true,
        user: {
            userid: user._id,
            username: user.username,
            email: user.email
        }
    })


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


        const alreadyVerifiedPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Already Verified — AskBase</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0A0A0A; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body>
  <div style="max-width:420px; width:90%; text-align:center; background:#111111; padding:48px 40px; border-radius:16px; border:1px solid #27272A; overflow:hidden; position:relative;">
    <div style="position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#F5FF3A,#ABD600);"></div>
    <p style="font-size:22px; font-weight:700; color:#FFFFFF; letter-spacing:-0.5px; margin-bottom:20px;">AskBase</p>
    <div style="font-size:36px; margin-bottom:16px;">✓</div>
    <h1 style="font-size:20px; font-weight:600; color:#FFFFFF; margin-bottom:10px; letter-spacing:-0.3px;">Already Verified!</h1>
    <p style="font-size:14px; color:#888887; line-height:1.7; margin-bottom:0;">
      Your AskBase account is already active. Head over to the login page to sign in.
    </p>
  </div>
</body>
</html>`

        const verifiedPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Verified — AskBase</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0A0A0A; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body>
  <div style="max-width:420px; width:90%; text-align:center; background:#111111; padding:48px 40px; border-radius:16px; border:1px solid #27272A; overflow:hidden; position:relative;">
    <div style="position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#F5FF3A,#ABD600);"></div>
    <p style="font-size:22px; font-weight:700; color:#FFFFFF; letter-spacing:-0.5px; margin-bottom:20px;">AskBase</p>
    <div style="font-size:36px; margin-bottom:16px;">✓</div>
    <h1 style="font-size:20px; font-weight:600; color:#FFFFFF; margin-bottom:10px; letter-spacing:-0.3px;">Account Verified!</h1>
    <p style="font-size:14px; color:#888887; line-height:1.7; margin-bottom:32px;">
      Your AskBase account is now active and ready to go.
    </p>
    <a href="https://askbase-qv8j.onrender.com/login"
       style="display:inline-block; background:linear-gradient(90deg,#F5FF3A,#ABD600); color:#0A0A0A; text-decoration:none; padding:13px 36px; border-radius:12px; font-size:14px; font-weight:700; letter-spacing:0.2px;">
      Go to Login
    </a>
  </div>
</body>
</html>`

        if (user.verified) {
            res.send(alreadyVerifiedPageHtml)

            return res.status(200).json({
                message: "User Already verified",
                success: true
            })
        }

        res.send(verifiedPageHtml)

        res.status(200).json({
            message: "User Registered",
            success: true
        })
    }
    catch (err) {
        return res.status(400).json({ message: "Invalid or expired token", success: false, err: err.message });

    }
}

const getMe = async (req, res) => {
    const { userid } = req.user;

    const user = await userModel.findById(userid)

    if (!user) return res.status(404).json({
        message: "User not found",
        success: false,
        err: "User not found with provided token"
    })


    res.status(200).json({
        message: "Fetched user details",
        success: true,
        user
    })
}


export default { register, resendEmail, login, verifyRegister, getMe }

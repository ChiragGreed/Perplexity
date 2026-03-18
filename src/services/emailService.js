import nodemailer from 'nodemailer'


const tranporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_URI,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
})

tranporter.verify((error, success) => {
    if (error) {
        console.log('Error connecting to email server:', error)
    }
    else {
        console.log("Email server is ready to send messages")
    }
})



const sendEmail = async (to, subject, html) => {

    try {
        const info = await tranporter.sendMail({
            from: `chiraggreed02@gmail.com ${process.env.GOOGLE_USER}`,
            to,
            subject,
            html
        })
    }
    catch (err) {
        console.log(`Error sending email to ${to} `, err)
    }

}

export default sendEmail

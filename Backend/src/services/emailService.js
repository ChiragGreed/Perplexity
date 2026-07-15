import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';


const tranporter = nodemailer.createTransport(
    sgTransport({
        auth: process.env.SENDGRID_API_KEY
    })
)


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

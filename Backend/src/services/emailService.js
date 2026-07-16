import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (to, subject, html) => {

    try {
        const [response] = await sgMail.send({
            from: `"AskBase:" <${process.env.GOOGLE_USER}>`,
            to,
            subject,
            html
        })
    }
    catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }

}

export default sendEmail;

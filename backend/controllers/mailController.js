import transporter from "../config/mail.js";

const convertToHtml = (text) => {
    return `
        <div style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            white-space: pre-line;
        ">
            ${text}
        </div>
    `;
};
export const sendMail = async (req, res) => {

    try {

        const { to, subject, body } = req.body;
        console.log(' to, subject, body : ', to, subject, body)
        if(!to){
            return res.status(400).json({
                success:false,
                message:"No recipients defined"
            })
        }

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: to,
            subject: subject||"Subject",
            html:  convertToHtml(body)||"Body"
        };


        const info = await transporter.sendMail(mailOptions);


        res.status(200).json({
            success: true,
            message: "Email sent successfully",
            messageId: info.messageId
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Email sending failed",
            error: error.message
        });

    }

};
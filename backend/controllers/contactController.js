const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

exports.sendContactMail = async (req, res) => {
  try {
    const {
      name,
      email,
      message,
    } = req.body;

    const data = await resend.emails.send({
       from:
        process.env.RESEND_FROM_EMAIL,

      to:
        process.env.CONTACT_RECEIVER_EMAIL,
        
      subject: `New Contact From ${name}`,

      html: `
        <h2>New Contact Message</h2>

        <p>
          <strong>Name:</strong> ${name}
        </p>

        <p>
          <strong>Email:</strong> ${email}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <p>${message}</p>
      `,
    });

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};
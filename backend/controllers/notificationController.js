// controllers/notificationController.js
import { sendEmail } from "../utils/sendEmail.js";

export const sendNotificationEmail = async (req, res) => {
  const { toEmail, subject, message } = req.body;

  try {
    await sendEmail({ to: toEmail, subject, text: message });
    res.status(200).json({ message: "Notification email sent." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};

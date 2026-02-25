import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (email, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, message: "Failed to send email" };
  }
};

export const sendPasswordResetEmail = (email, resetToken, resetUrl) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link will expire in 30 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail(email, "Password Reset Request", html);
};

export const sendWelcomeEmail = (email, name) => {
  const html = `
    <h2>Welcome to BookMart, ${name}!</h2>
    <p>Thank you for joining our online bookstore.</p>
    <p>You can now browse and purchase your favorite books.</p>
    <a href="${process.env.FRONTEND_URL}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Shopping</a>
  `;

  return sendEmail(email, "Welcome to BookMart", html);
};

export const sendOrderConfirmationEmail = (email, orderNumber, items, totalPrice) => {
  const itemsHtml = items.map((item) => `<p>${item.bookName} x${item.quantity} - $${item.price}</p>`).join("");

  const html = `
    <h2>Order Confirmation</h2>
    <p><strong>Order ID:</strong> ${orderNumber}</p>
    <h3>Items:</h3>
    ${itemsHtml}
    <p><strong>Total Amount:</strong> $${totalPrice}</p>
    <p>Thank you for your order!</p>
  `;

  return sendEmail(email, "Order Confirmation - BookMart", html);
};

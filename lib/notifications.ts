import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// WhatsApp API configuration (using a service like Twilio or direct WhatsApp Business API)
const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    // Using Twilio WhatsApp API as an example
    // You can replace this with your preferred WhatsApp service
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+91${to}`,
    });

    console.log("WhatsApp message sent successfully");
  } catch (error) {
    console.error("WhatsApp message failed:", error);
    // Fallback: You can implement a simple HTTP request to your WhatsApp service
    // or use WhatsApp Business API directly
  }
};

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!to) return; // Skip if no email provided

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

export const sendOrderConfirmation = async (order: any, status: string) => {
  const customerName = order.customerInfo.name;
  const orderNumber = order.orderNumber;
  const totalAmount = order.totalAmount;
  const whatsappNumber = order.customerInfo.whatsappNumber;
  const email = order.customerInfo.email;

  // WhatsApp message
  const whatsappMessage = `🎉 Order Confirmed!

Hi ${customerName}!

Your order #${orderNumber} has been confirmed.
Total Amount: ₹${totalAmount}

Order Details:
${order.items
  .map((item: any) => `• ${item.productName} (Qty: ${item.quantity})`)
  .join("\n")}

Estimated Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString(
    "en-IN"
  )}

We'll keep you updated on your order status. Thank you for choosing Handcrafted Gifts! 💝

Track your order: ${process.env.NEXT_PUBLIC_SITE_URL}/track`;

  // Email HTML
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #FFE4E1 0%, #E6E6FA 100%); padding: 30px; text-align: center;">
        <h1 style="color: #4A4A4A; margin: 0;">Order Confirmed! 🎉</h1>
      </div>
      
      <div style="padding: 30px; background: white;">
        <p>Hi ${customerName},</p>
        
        <p>Thank you for your order! We're excited to create something special for you.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4A4A4A;">Order Details</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <p><strong>Estimated Delivery:</strong> ${new Date(
            order.estimatedDelivery
          ).toLocaleDateString("en-IN")}</p>
          
          <h4>Items:</h4>
          <ul>
            ${order.items
              .map(
                (item: any) => `
              <li>${item.productName} - Quantity: ${item.quantity}
                ${
                  item.customization?.text
                    ? `<br><small>Customization: ${item.customization.text}</small>`
                    : ""
                }
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
        
        <p>We'll send you regular updates about your order status via WhatsApp and email.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/track" 
             style="background: #FFB6C1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
            Track Your Order
          </a>
        </div>
        
        <p>If you have any questions, feel free to reach out to us!</p>
        
        <p>With love,<br>Handcrafted Gifts Team 💝</p>
      </div>
    </div>
  `;

  // Send notifications
  await Promise.all([
    sendWhatsAppMessage(whatsappNumber, whatsappMessage),
    sendEmail(email, `Order Confirmed - ${orderNumber}`, emailHtml),
  ]);
};

export const sendOrderStatusUpdate = async (order: any, newStatus: string) => {
  const customerName = order.customerInfo.name;
  const orderNumber = order.orderNumber;
  const whatsappNumber = order.customerInfo.whatsappNumber;
  const email = order.customerInfo.email;

  const statusMessages = {
    confirmed: "Your order has been confirmed and we're preparing it! 🎨",
    "in-progress": "Great news! We've started working on your order! 🎨",
    completed: "Your order is ready and will be shipped soon! 📦",
    shipped: "Your order is on its way to you! 🚚",
    delivered: "Your order has been delivered! We hope you love it! 🎉",
    cancelled:
      "Your order has been cancelled. If you have any questions, please contact us.",
  };

  const statusEmojis = {
    confirmed: "✅",
    "in-progress": "🎨",
    completed: "✨",
    shipped: "📦",
    delivered: "🎉",
    cancelled: "❌",
  };

  const message =
    statusMessages[newStatus as keyof typeof statusMessages] ||
    "Your order status has been updated.";
  const emoji = statusEmojis[newStatus as keyof typeof statusEmojis] || "📋";

  // WhatsApp message
  const whatsappMessage = `${emoji} Order Update

Hi ${customerName}!

Order #${orderNumber} - Status Update:
${message}

${
  newStatus === "shipped"
    ? `Track your package and expect delivery within 2-3 days.`
    : ""
}
${
  newStatus === "delivered"
    ? `Thank you for choosing Handcrafted Gifts! We'd love to see how you're enjoying your purchase. 📸`
    : ""
}

Track your order: https://stichkala.vercel.app/track`;

  // Email HTML
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #FFE4E1 0%, #E6E6FA 100%); padding: 30px; text-align: center;">
        <h1 style="color: #4A4A4A; margin: 0;">Order Update ${emoji}</h1>
      </div>
      
      <div style="padding: 30px; background: white;">
        <p>Hi ${customerName},</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0; color: #4A4A4A;">Order #${orderNumber}</h3>
          <p style="font-size: 18px; color: #FFB6C1; font-weight: bold;">${message}</p>
        </div>
        
        ${
          newStatus === "shipped"
            ? "<p>Your package is on its way! You can expect delivery within 2-3 days.</p>"
            : ""
        }
        ${
          newStatus === "delivered"
            ? "<p>We hope you absolutely love your handcrafted item! If you're happy with your purchase, we'd love to see a photo. 📸</p>"
            : ""
        }
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://stichkala.vercel.app/track" 
             style="background: #FFB6C1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
            Track Your Order
          </a>
        </div>
        
        <p>Thank you for choosing Handcrafted Gifts!</p>
        
        <p>With love,<br>Handcrafted Gifts Team 💝</p>
      </div>
    </div>
  `;

  // Send notifications
  await Promise.all([
    sendWhatsAppMessage(whatsappNumber, whatsappMessage),
    sendEmail(email, `Order Update - ${orderNumber}`, emailHtml),
  ]);
};

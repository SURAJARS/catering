/**
 * Email Transporter Configuration
 * Development mode: using null transporter (emails logged but not sent)
 */
const createEmailTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️ Email transporter not configured. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD in .env');
    // In production, you should have real email config
  }

  // Use null transporter for development (logs emails instead of sending)
  const transporter = {
    sendMail: (mailOptions, callback) => {
      console.log('\n📧 Email (Development Mode - Not Sent)');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('From:', mailOptions.from || process.env.EMAIL_USER);
      console.log('---');
      if (callback) callback(null, { messageId: 'dev-' + Date.now() });
    },
    verify: (callback) => {
      if (callback) callback(null, true);
    }
  };

  console.log('✓ Email transporter ready (Development Mode)');
  return transporter;
};

export default createEmailTransporter;

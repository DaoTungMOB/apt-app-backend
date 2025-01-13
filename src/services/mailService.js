const mailService = {
  sendMail: async (transporter, mailOptions) => {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Send mail success: ", info.messageId);
      return info;
    } catch (error) {
      console.log("Send mail error: ", error);
    }
  },
};

module.exports = mailService;

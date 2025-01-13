module.exports = {
  generateOTP: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  forgotPassOtpHtml: (otp) => {
    return `
      <b>Mã xác thực tạo mật khẩu mới của bạn là ${otp}</b>
    `;
  },
};

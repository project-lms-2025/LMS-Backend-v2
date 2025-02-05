let otpStore = {};

class OtpService {
  static generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static saveOtp(email, otp, otpExpiry) {
    otpStore[email] = { storedOtp: otp, otpExpiry };
  }

  static getOtp(email) {
    return otpStore[email];
  }

  static deleteOtp(email) {
    delete otpStore[email];
  }
}

export default OtpService;

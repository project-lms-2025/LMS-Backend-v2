let otpStore = {};

class OtpService {
  static generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

static saveOtp(email, otp, otpExpiry) {
  otpStore[email] = { storedOtp: otp, otpExpiry };
}

static getOtp(email) {
  const otp = otpStore[email];
  if (otp) {
    return { success: true, statusCode: 200, message: "OTP retrieved", otp };
  } else {
    return { success: false, statusCode: 404, message: "OTP not found" };
  }
}

static deleteOtp(email) {
  const otpExists = otpStore[email];
  if (otpExists) {
    delete otpStore[email];
    return { success: true, statusCode: 200, message: "OTP deleted" };
  }
  return { success: false, statusCode: 404, message: "OTP not found" };
}

}

export default OtpService;

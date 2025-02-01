let otpStore = {};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveOtp = (email, otp, otpExpiry) => {
  otpStore[email] = { storedOtp: otp, otpExpiry };
};

const getOtp = (email) => {
  return otpStore[email];
};

const deleteOtp = (email) => {
  delete otpStore[email];
};

module.exports = { generateOtp, saveOtp, getOtp, deleteOtp };

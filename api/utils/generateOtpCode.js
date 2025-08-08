export default function generateOtpCode(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // digits 0-9
  }
  return otp;
}

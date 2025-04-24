const express = require('express');
const path = require('path');
const app = express();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('./public/models/user');
const bcrypt = require('bcrypt');
app.use(express.urlencoded({ extended: true }));



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cartikeya.official@gmail.com',
    pass: 'mnpe xrxk uhyh pmaq' // use App Password (not your Gmail password)
  }
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index');
});
app.get('/sign-in', (req, res) => {
  res.render('signin/signin', {
    showSignup: false, // Ensure the signup form is hidden
    showOTP: false,    // Ensure the OTP input is hidden
    errorMessage: null // No error message initially
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



app.use(express.urlencoded({ extended: true })); // Parse form data

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    console.log('Login:', email, password);
    // TODO: verify user from database
    res.send('Login logic goes here');
});




mongoose.connect('mongodb+srv://cartikeyaofficial:WD5o2ocdHsCxIiHx@cluster0.tjhetcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("❌ MongoDB connection error:", err));




function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}


app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.render('signin/signin', {
      showSignup: true,
      errorMessage: "User already exists"
    });
  }

  const otp = generateOTP();

  // Send OTP email
  const mailOptions = {
    from: 'cartikeya.official@gmail.com',
    to: email,
    subject: 'Your OTP for C2C Signup',
    text: `Your OTP is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false
    });

    await newUser.save();

    res.render('signin/signin', {
      showSignup: true,
      showOTP: true,
      email: email,
      errorMessage: "OTP sent to email. Please enter it to verify."
    });

  } catch (err) {
    console.error(err);
    res.send("Error sending OTP email.");
  }
});



app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (user && user.otp === otp) {
    user.isVerified = true;
    user.otp = null;
    await user.save();
    return res.render('signin/signin', {
      showSignup: false,
      errorMessage: "✅ Email verified! You can now log in."
    });
  }

  res.render('signin/signin', {
    showSignup: true,
    showOTP: true,
    errorMessage: "❌ Invalid OTP. Try again."
  });
});
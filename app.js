const express = require('express');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index');
});
app.get('/sign-in', (req, res) => {
  res.render('signin/signin');
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

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    console.log('Signup:', email, password);
    // TODO: save new user to database
    res.send('Signup logic goes here');
});

// const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://cartikeyaofficial:<1234567890>@stationary-login.k2job.mongodb.net/?retryWrites=true&w=majority&appName=Stationary-login')
// .then(() => console.log("✅ Connected to MongoDB"))
// .catch(err => console.log("❌ MongoDB connection error:", err));
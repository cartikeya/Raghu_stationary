const express = require('express');
const path = require('path');
const app = express();


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
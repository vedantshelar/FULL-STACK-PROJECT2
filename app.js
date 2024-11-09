if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = new express();
const indexRoutes = require('./routes/indexRoutes');
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.listen(3000, () => {
    console.log("server is listening to port 3000");
})
 
// database connection

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/SKILLHUB');
}

main().then(() => {
    console.log("database is connected successfully");
}).catch(() => {
    console.log("error while connecting to database");
})

// middlewares

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(cookieParser('skillhubweb'));
app.use(session({
    secret: 'skillhubweb',
    resave: false,
    saveUninitialized: true
}))

// user middleware

app.use((req,res,next)=>{
    res.locals.currUser = req.session.currUser;
    res.locals.admin = req.session.admin;
    next()
})

//route 
 
app.use('/',indexRoutes);  
app.use('/admin',adminRoutes);
app.use('/profile', profileRoutes);
app.use('/project', projectRoutes); 

// ERROR HANDLING MIDDLEWARE   

app.use(async (err, req, res, next) => {
    console.log(err);
    res.send("error"); 
}) 
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require('express');
const app = new express();
const mongoose = require('mongoose'); 
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
var flash = require('connect-flash');
const indexRoutes = require('./routes/indexRoutes');
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.listen(3000, () => {
    console.log("server is listening to port 3000");
})
 
// database connection

async function main() {
    await mongoose.connect(process.env.DATABASE_CONNECTION_URL); 
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
app.use(cookieParser(process.env.SECRET));
app.use(session({ 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge:7 * 24 * 60 * 60 * 1000, // Set cookie expiry to 1 day (in milliseconds)
      },
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_CONNECTION_URL,
        touchAfter: 60*60*24, // time period in seconds
        ttl:60*60*24*7, // time period in seconds
        collectionName:'userSessions',
        crypto: {
            secret: process.env.SECRET
          }
      })  
}));
app.use(flash());

// user middleware

app.use((req,res,next)=>{
    res.locals.currUser = req.session.currUser;
    res.locals.admin = req.session.admin;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next()
})

//route 

app.use('/',indexRoutes);  
app.use('/admin',adminRoutes);
app.use('/profile', profileRoutes);
app.use('/project', projectRoutes); 

// ERROR HANDLING MIDDLEWARE   

app.use(async (err, req, res, next) => {
    res.send(err.errorResponse.errmsg); 
}) 
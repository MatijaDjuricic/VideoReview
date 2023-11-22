const express = require('express');
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const cors = require('cors');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Review = require('./models/Review');
require('dotenv').config();
const url = process.env.URL;
const backendPort = process.env.BACKEND_PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cors({
    origin: ['https://videoreview.netlify.app'],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", 'https://videoreview.netlify.app');
    res.header(
        "Access-Control-Allow-Mehtods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    key: "userId",
    secret: "VideoReviewApp",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 24 * 60 * 60 * 1000,
    },
    store: new MemoryStore({
      checkPeriod: 86400000
    })
}));
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB")).catch(console.error);
app.post('/users/register', async(req, res) => {
    const {name, email, password} = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) throw err;
        const data = {
            name: name,
            email: email,
            password: hash
        };
        const chack = await User.findOne({email: email});
        if (!chack) {
            await User.insertMany([data]);
            res.json(data);
        } else res.json("exist");
    });
});
app.post('/users/login', async(req, res) => {
    const {email, password} = req.body;
    const chack = await User.findOne({email: email});
    if (chack) {
        bcrypt.compare(password, chack.password, (error, response) => {
            if (error) throw error;
            if (response) {
                req.session.user = chack;
                res.json(chack);
            } else res.json("notexist");
        });
    } else res.json("notexist");
});
app.get('/users/login', async(req, res) => {
    if (req.session.user) {
        return res.json({loggedIn: true, user: req.session.user});
    } else return res.json({loggedIn: false});
});
app.get('/users/logout', async(req, res) => {
    req.session.destroy();
    res.clearCookie('userId');
    return res.json({loggedOut: true});
});
app.get('/users/user/:id', async(req, res) => {
    const user = await User.findById(req.params.id);
    return res.json(user);
});
app.patch('/users/user/edit/:id', async(req, res) => {
    const {name, email, password} = req.body;
    const chack = await User.findById(req.params.id);
    bcrypt.compare(password, chack.password, async(error, response) => {
        if (error) throw error;
        if (response) {
            const data = {
                name: name,
                email: email
            };
            const user = await User.findByIdAndUpdate({_id: req.params.id}, data, {new: true});
            req.session.user = user;
            res.json(user);
        } else res.json("notexist");
    });
});
app.post('/reviews/create', async(req, res) => {
    const {video_id, user_id, name, content, rating, title, channel, thumbnail} = req.body;
    const data = {
        video_id: video_id,
        user_id: user_id,
        name: name,
        content: content,
        rating: rating,
        title: title,
        channel: channel,
        thumbnail: thumbnail
    };
    await Review.insertMany([data]);
    res.json(data);
});
app.get('/reviews/review/:id', async(req, res) => {
    const review = await Review.find({video_id: req.params.id});
    if (review) return res.json({review: review});
    else return res.json("notexist");
});
app.get('/reviews/user/:id', async(req, res) => {
    const review = await Review.find({user_id: req.params.id});
    if (review) return res.json({review: review});
    else return res.json("notexist");
});
app.delete('/reviews/review/delete/:id', async(req, res) => {
    const review = await Review.findByIdAndRemove(req.params.id);
    return res.json(review);
});
app.listen(backendPort, () => console.log(`listening on port:${backendPort}...`));
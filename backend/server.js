const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Review = require('./models/Review');
require('dotenv').config();
const Port = process.env.PORT || 8080;
const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: ["https://videoreview.netlify.app"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB")).catch(console.error);
app.post('/users/register', async(req, res) => {
    const {name, email, password} = req.body;
    bcrypt.hash(password, 10, async(err, hash) => {
        const chack = await User.findOne({email: email});
        if (err) throw err;
        const data = {
            name: name,
            email: email,
            password: hash,
        };
        if (!chack) {
            await User.insertMany([data]);
            res.json(data);
        } else res.json("exist");
    });
});
app.post('/users/login', async(req, res) => {
    const {email, password} = req.body;
    const check = await User.findOne({email: email});
    if (check) {
        var generatedCookie = Buffer.from(Math.floor(Date.now() / 1000) + '.' + check._id + '.' + check.password).toString('base64');
        data = { 
            session_cookie: generatedCookie
        }
        bcrypt.compare(password, check.password, async(err, response) => {
            if (err) throw err;
            if (response) {
                const user = await User.findByIdAndUpdate({_id: check.id}, data, {new: true});
                res.json(user);
            } else res.json("notexist");
        });
    } else res.json("notexist");
});
app.get('/users/check', async(req, res) => {
    const {session_cookie} = req.body;
    const check = await User.findOne(session_cookie);
    if (check) res.json(check);
    else res.json("notexist");
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
app.listen(Port, () => console.log(`listening on port:${Port}...`));
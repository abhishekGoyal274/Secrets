//jshint esversion:6
require("dotenv").config();
const express = require('express');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


//Database

mongoose.connect("mongodb+srv://Abhishek-admin:Tango_0range@cluster0.hsdpq.mongodb.net/Auth&Sec", { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = new mongoose.model("User", userSchema);

/////////////////////////////Routes/////////////////////////////
app.get("/home", function(req, res) {
    res.render("home");
})


//Register Route
app.route("/register")
    .get(function(req, res) {
        res.render("register");
    })
    .post(function(req, res) {
        User.find({ email: req.body.username }, function(err, user) {
            console.log(user);
            if (user.length != 0) {
                res.render("login");
            } else {
                const user = new User({
                    email: req.body.username,
                    password: req.body.password
                });
                user.save(function(err) {
                    if (err) {
                        res.send(err.message);
                    } else {
                        res.render("secrets");
                    }
                });
            }
        });
    })

//Login Route
app.route("/login")
    .get(function(req, res) {
        res.render("login");
    })
    .post(function(req, res) {
        User.find({ email: req.body.username }, function(err, user) {
            if (user.length != 0) {
                if (user[0].password === req.body.password) {
                    res.render("secrets");
                } else {
                    res.render("login");
                }
            } else {
                res.render("register");
            }
        });
    })


//Listen Route
app.listen(3000, function() {
    console.log("Listening on port 3000...");
})
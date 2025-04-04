// jshint version:6

const express = require ("express");
const bodyParser = require ("body-parser");
const  ejs    = require ("ejs");
const axios = require('axios');
const path = require("path");
require('dotenv').config();

const listId = process.env.MAILCHIMP_LIST_ID;  // Make sure this matches the lowercase .env variable
const apiKey = process.env.MAILCHIMP_API_KEY;  // Make sure this matches the lowercase .env variable
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;  // Make sure this matches the lowercase .env variable

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use('/fontawesome', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')));

app.get("/",  function(req, res){
    res.render("home")
});

app.get("/success", function(req, res){
    res.render("success")
});

app.get("/fail", function(req, res){
    res.render("fail")
});

app.post("/", async function(req, res){
    const email = req.body.email;

    const data = {
        email_address: email,
        status: "subscribed"
    };

    try {
        const response = await axios.post(
            `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`,  // Use lowercase variables
            data,
            {
                auth: {
                    username: "anystring", // Required but ignored
                    password: apiKey  // Use lowercase variables
                }
            }
        );

        if (response.status === 200) {
            res.render("success"); // Render a success page
        } else {
            res.render("fail");
        }
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.render("fail");
    }
});

app.listen(process.env.PORT  || 4000, function(){
    console.log("server is running on port 4000");
});

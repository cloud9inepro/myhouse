// jshint version:6

const express = require ("express");
const bodyParser = require ("body-parser");
const  ejs    = require ("ejs");
const axios = require('axios');


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const API_KEY = "490fd9d300e722788892a9cb2c551a80-us20";
const SERVER_PREFIX = "us20";
const LIST_ID = "a04647d291";

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
            `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
            data,
            {
                auth: {
                    username: "anystring", // Required but ignored
                    password: API_KEY
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




app.listen(4000, function(){
    console.log("server is running on port 4000");
});

//API KEY
// 490fd9d300e722788892a9cb2c551a80-us20
//mailchimp id
// a04647d291

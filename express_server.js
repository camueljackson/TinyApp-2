var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


var cookieParser = require('cookie-parser')
app.use(cookieParser())

// *************************


function generateRandomString() {
return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  console.log(templateVars);
  res.render("urls_home", templateVars)
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const templateVars = { shortURL: req.params.id, longURL: urlDatabase[shortURL], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.cookie("username", req.body.username);
  res.clearCookie("username", req.body.username);
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  var randomString = generateRandomString();
  urlDatabase[randomString] = req.body["longURL"];
  res.redirect("/urls/" + randomString);
});

// DELETE

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls/");
});

// REDIRECT

app.get("/u/:shortURL", (req, res) => {
  let templateVars = {username: req.cookies["username"]};
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// LISTEN

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

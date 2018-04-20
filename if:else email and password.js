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

var users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "user3RandomID": {
    id: "user2RandomID",
    email: "me@cam.com",
    password: "pass"
  }
}

// ******************************


app.get("/", (req, res) => {
  let userID = req.cookies["user_id"];
  let user = users[userID];

  let templateVars = {
   user: user
 };

   res.render("urls_home", templateVars)
 });


app.get("/urls", (req, res) => {
  let userID = req.cookies["user_id"];
  let user = users[userID];

  let templateVars = {
    urls: urlDatabase,
   user: user
 };
  res.render("urls_index", templateVars);
});


app.get("/register", (req, res) => {
  res.render("register");
});


app.post("/register", (req, res) => {
  let randomID = generateRandomString();
  let email = req.body.email
  let password = req.body.password
  let newUser = {
    id: randomID,
    email: email,
    password: password
  }
  users[randomID] = newUser //  meaning the random new ID can be added to the user database and take a value of the NewUser object
  res.cookie("user_id", randomID) // user_ID is the name of my cookie, and neUser is the value that the cookie stores

  if (email == "" || password == "") {
    res.statusCode = 400;
    res.send('Error 400 -- Invalid Credentials');

  } else if (email == email) {
    res.status = 400;
    res.send('Error 400 -- email in use');

  } else {
    res.redirect("/urls");
  }
});

app.get("/urls/new", (req, res) => {

  let userID = res.cookie["user_id"]; // user ID is equal to my cookie which stores my random user ID
  let user = users[userID];

  let templateVars = {
    user: user
  };

  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  let userID = res.cookie["user_id"];
  let user = users[userID];
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[shortURL],
    user: user
  };

  res.render("urls_show", templateVars);
});


app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});


app.get("/login", (req, res) => {
  let userID = req.cookies["user_id"];
  let user = users[userID];

  let templateVars = {
   user: user
 };

 res.render("login", templateVars)
 });


app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let found = false;
  let foundPassword = false;

  for (const userID in users) {           // looping through my users object
    if (email == users[userID].email) {
      found = true;
    }
  }
    if (found == true) {
    for (const findPW in users) {
      if (password == users[findPW].password) {
        foundPassword = true;
        console.log("found password!")
        res.cookie("user_id", users[findPW].id);
        res.redirect("/");

      }
    }
  }

  if (found == false) {
    res.status(403).send("Error 403 -- Not an email");


   } if (foundPassword == false) {
    res.status(403).send("Error 403 -- Not a password");
   }

  });

app.post("/logout", (req, res) => {
  res.cookie("user_id");
  res.clearCookie("user_id");
  res.redirect("/urls");
});

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
  let userID = req.cookies["user_id"];
  let user = users[userID];
  let templateVars = {user: user};
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// LISTEN

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

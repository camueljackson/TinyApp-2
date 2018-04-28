const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
app.set("view engine", "ejs");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ["It's not easy being a cookie"],

  maxAge: 24 * 60 * 60 * 1000
}))

const bcrypt = require("bcrypt");

// *************************


function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

var urlDatabase = {
  "b2xVn2": {
    "longURL": "http://www.lighthouselabs.ca",
    "userID": "userRandomID",
  },
  "9sm5xK": {
    "longURL": "http://www.google.com",
    "userID": "user3RandomID",
  }
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

/* HOME PAGE */
app.get("/", (req, res) => {
  let user = users[req.session.user_id];

  let templateVars = {  // available info
  user: user
};

res.render("urls_home", templateVars)
});


// app.get("_header", (req, res) => {
//   let userID = req.cookies["user_id"];
//   let user = users[userID];
//   let templateVars = {
//     "user": users[userID]
//   }
//   res.render();
// });


/* LIST OF URLS */
app.get("/urls", (req, res) => {
  console.log(users);
  console.log(req.session);
  let user = users[req.session.user_id];
  let templateVars = { // templateVars object contains "user" and "URL database"
  urls: urlDatabase,
  user: user
};



res.render("urls_index", templateVars);
});

/* REGISTRATION PAGE*/
app.get("/register", (req, res) => {
  res.render("register");
});

/* REGISTRATION PAGE*/
app.post("/register", (req, res) => {
  let randomID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  let hashedPassword = bcrypt.hashSync(password, 10)
  let newUser = {
    id: randomID,
    email: email,
    password: hashedPassword
  }

  for (const userInfo in users) {
    if (email === users[userInfo].email) { // looping through my users obj, userInfo is rando ID
      res.statusCode = 400;
      res.send("Error 400 -- Email already in use");
      return;
    }
  }
  if (email === "" || password === "") {
    res.statusCode = 400;
    res.send("Error 400 -- Invalid Credentials");
    return;
  }
    users[randomID] = newUser; //  meaning the random new ID can be added to the user database and take a value of the NewUser object
    req.session.user_id = randomID; // user_ID is the name of my cookie, and randomid is the value that the cookie stores
    res.redirect("/urls");

    console.log(users);
  });


/* ADDING URLS to the urls database */

app.get("/urls/new", (req, res) => {    //
  let user = users[req.session.user_id];
  let templateVars = {
    user: user,
    urls: urlDatabase
  }
  res.render("urls_new", templateVars);
});


/*  */

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id; // shortURL var created
  let user = users[req.session.user_id];// userID = that specific cookie
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: user
  };

  res.render("urls_show", templateVars);
});


app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let userID = res.cookies["user_id"];
  let longURL = req.body.longURL;
  urlDatabase[req.params.id] = {
    longURL: longURL,
    createdBy: req.cookie["user_id"]
  }
  res.redirect("/urls");

});


app.get("/login", (req, res) => {
  let user = users[req.session.user_id];
  let email = req.body.email

  let templateVars = {
   user: user,
   email: email
 };

 res.render("login", templateVars)
});


app.post("/login", (req, res) => {
  let email = req.body.email;
  let inputPassword = req.body.password;

  let hashedPassword = bcrypt.hashSync(inputPassword, 10);

  let foundUser;

  for (const userID in users) {
    if (email == users[userID].email) {
       foundUser = users[userID];
       break;
    }
  }
  if (foundUser) {
    if ( bcrypt.compareSync(foundUser.password, hashedPassword) ){
        req.session.user_id = foundUser.id;
        res.redirect("/urls");
        return;
    }
  }
  res.status(403).send("Error 403 -- Not an email");

});

app.post("/logout", (req, res) => {
  req.session.user_id = null
  res.redirect("/");
});


app.post("/urls", (req, res) => {
  // let user = users[req.session.user_id];
  let shortURL = generateRandomString(); // random url being generated with the long URL you create
  let longURL = urlDatabase[req.params.longURL];

  urlDatabase[shortURL] = {
    "longURL": longURL
  }

  res.redirect("/urls/" + shortURL); // brings you back to the urls database page along with the random string generated
});

// DELETE

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];

  res.redirect("/urls");
});


// REDIRECT

app.get("/u/:shortURL", (req, res) => {
  let userID = req.cookies["user_id"];
  let user = users[userID];
  let wantedURL = urlDatabase[req.params.shortURL].longURL;
  debugger
  console.log(wantedURL+'ass');
  let templateVars = {
    user: user,
    longURL: wantedURL
  };

  res.redirect(wantedURL);
});




// LISTEN

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
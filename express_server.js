const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
app.set("view engine", "ejs");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

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
  let userID = req.cookies["user_id"]; //userID set to unique cookie
  let user = users[userID]; // user equal to the object "users database- Key: unique ID"

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
  let userID = req.cookies["user_id"];
  let user = users[userID];

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
    res.cookie("user_id", randomID) // user_ID is the name of my cookie, and randomid is the value that the cookie stores
    res.redirect("/urls");

    console.log(users);
  });


/* ADDING URLS to the urls database */

app.get("/urls/new", (req, res) => {    //
  let userID = req.cookies["user_id"];
  let templateVars = {
    user: users[userID],
    urls: urlDatabase
  }
  res.render("urls_new", templateVars);
});


/*  */

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id; // shortURL var created
  let userID = req.cookies["user_id"]; // userID = that specific cookie
  let user = users[userID]; //navigating in users database, using the unique key
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
  let userID = req.cookies["user_id"];
  let user = users[userID];
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

  let found = false;
  let foundPassword = false;

  for (const userID in users) {
    if (email == users[userID].email) {
      found = true;
    }
  }

// if email has been found in the database, loop through passwords in database to find matching password and user login info
  if (found == true) {
    for (let findPW in users) {
      let currentPassW = users[findPW].password;
      if (bcrypt.compareSync(inputPassword, hashedPassword)) {
        foundPassword = true;

        res.cookie("user_id", users[findPW].id);
        res.redirect("/urls");

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
  res.redirect("/");
});


app.post("/urls", (req, res) => {
  let longURL = req.body.longURL
  let userID = req.cookies["user_id"];
  let shortURL = generateRandomString(); // random url being generated with the long URL you create

  urlDatabase[shortURL] = {
    "longURL": longURL,
    "userID": userID
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
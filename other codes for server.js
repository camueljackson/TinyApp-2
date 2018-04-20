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
  }


    for (const regEmail in users) {

  }


  for (const regEmail in )


  } else if (email == users[]) {
    res.status = 400;
    res.send('Error 400 -- email in use');

  } else {
    res.redirect("/urls");
  }
});

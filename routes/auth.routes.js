const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  // added by Pelayo 20-08-22: added email and confirmPassword from the req.body destructuring.
  const { username, email, password, confirmPassword } = req.body;

  if (!username) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your username.",
    });
  }

  if (!email) {
    return res.status(400).render("auth/signup", {
      emailError: "Please add an email",
      ...req.body,
    });
  }

  if (!email.includes("@")) {
    // @email andre@ || @
    return res.status(400).render("auth/signup", {
      emailError: "Please introduce a valid email",
      ...req.body,
    });
  }

  // **************** email validation handler from deep email validator documentation: https://www.abstractapi.com/guides/node-email-validation#:~:text=Node%20email%20validation.-,How%20Do%20I%20Check%20if%20An%20Email%20is%20Valid%20in,and%20the%20SMTP%20server%20response. *******
  // router.post('/register', async function(req, res, next) {
  //   const {email, password} = req.body;

  //   if (!email || !password){
  //     return res.status(400).send({
  //       message: "Email or password missing."
  //     })
  //   }

  //   const {valid, reason, validators} = await isEmailValid(email);

  //   if (valid) return res.send({message: "OK"});

  //   return res.status(400).send({
  //     message: "Please provide a valid email address.",
  //     reason: validators[reason].reason
  //   })

  // });

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).render("auth/signup", {
      passwordError: "Your password and your confirmed password must match",
      ...req.body,
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length

  // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  // if (!regex.test(password)) {
  //   return res.status(400).render("signup", {
  //     errorMessage:
  //       "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
  //   });
  // }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          // 23/08/22 - Pelayo: added email, favorites and role
          username,
          email,
          password: hashedPassword,
          // favorites, DONT DO IT, IT WILL BREAK THE USER CREATION ON SIGNUP
          // role, SAME AS ABOVE
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please provide your username.",
    });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // added by Pelayo 20-08-22: trying to implement confirm password at registration
  if (password !== confirmPassword) {
    return res.status(400).render("auth/signup", {
      passwordError:
        "Could you at least pretend like you give a damn?. Could these AT LEAST be the same? For once?... Could you not? We've been through this... It is written... Are you that dumb? You must be... Otherwise you would have done what we ask you to do... So could you, for once in your miserable life, do what youre told? Thank you",
      ...req.body,
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login", {
            errorMessage: "Wrong credentials.",
          });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // generate token
const bcrypt = require("bcrypt"); // encrypt password

// req validation
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar"); // get user image by email

// Models
const User = require("../models/User");

// @route  POST api/user/register
// @desc   Register user
// @access Public
router.post(
  "/register",
  [
    // validation
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail().not().isEmpty(),
    check(
      "password",
      "Please enter a passsword with 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        erros: errors.array(),
      });
    }
    // get name, email & password from request
    const { name, email, passsword } = req.body;

    try {
      // check if user exist
      let user = await User.findOne({ email });

      // if user exist
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User already exists",
            },
          ],
        });
      }

      // if user not exist
      // get image from gravatar
      const avatar = gravatar.url(email, {
        s: "200", // size
        r: "pg", // rate
        d: "mm",
      });

      // create user object
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10); // generate salt
      // save password
      user.password = await bcrypt.hash(password, salt); // user user password & salt to hash password
      // save user into database
      await user.save();

      // payload to generate token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000, // for development, in prod change to 3600
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

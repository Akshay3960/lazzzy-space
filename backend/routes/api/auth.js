const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypesAllowed = ["image/jpeg", "image/jpg", "image/png"];

  //check whether filetype allowed is acceptable
  if (fileTypesAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const profile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

/*User registration */

router.post("/signup", profile.single("pic"), async (req, res) => {
  try {
    //check if user already exist
    const fetched_user = await User.find({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (fetched_user.length != 0) {
      console.log(fetched_user);
      return res.status(500).json("User already exist");
    }
    if (req.file) {
      const cryptsalt = await bcrypt.genSalt(10);
      const hashedpass = await bcrypt.hash(req.body.password, cryptsalt);
      const new_user = await new User({
        email: req.body.email,
        username: req.body.username,
        password: hashedpass,
        color: req.body.color,
        image: {
          file: {
            path: req.file.path,
          },
        },
      });

      const result = await new_user.save();
      res.status(200).json(result);
    } else {
      const cryptsalt = await bcrypt.genSalt(10);
      const hashedpass = await bcrypt.hash(req.body.password, cryptsalt);
      const new_user = await new User({
        email: req.body.email,
        username: req.body.username,
        password: hashedpass,
        color: req.body.color,
      });

      const result = await new_user.save();
      res.status(200).json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    //Assuming there is old cookies
    const cookies = req.cookies;

    const user = await User.findOne({
      email: req.body.email,
    });
    !user && res.status(404).json("User not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    !validPass && res.status(400).json("Wrong Password");
    //Create the JWT
    const accessToken = jwt.sign(
      {
        "username": user.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    //create refresh token
    const refreshToken = jwt.sign(
      { "username": user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //If there is old refresh token
    //eg: user goes to login without logging out
    let newRefreshTokenArray = !cookies?.jwt
      ? user.refreshToken
      : user.refreshToken.filter((rt) => rt !== cookies.jwt);
    if (cookies?.jwt) {
      const Token = cookies.jwt;
      const foundToken = await User.findOne({ Token });

      // Detected refresh token reuse!
      if (!foundToken) {
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: false,
      });
    }

    // Add new refresh token to user
    user.refreshToken = [...newRefreshTokenArray, refreshToken];
    const result = await user.save();
    //Send new refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    }); // set secure to true when its in production

    // Send authorization roles and access token to user
    res.status(200).json({ result, accessToken });
  } catch (err) {
    console.log(err);
  }
});

router.post("/logout", async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
  res.sendStatus(204);
});

module.exports = router;

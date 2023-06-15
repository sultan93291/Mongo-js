const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const router = express.Router();
const userSchemas = require('./schemas/userScehmas');
const User = new mongoose.model('User', userSchemas);
dotenv.config();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      userName: req.body.userName,
      password: hashedPassword,
      status: req.body.status,
    });
    await newUser.save();
    res.status(200).json({ message: `successfully Created User  ` });
  } catch (err) {
    res.status(500).send(` Can't create or sign up becasuse : ${err.message}`);
    console.log(err.message);
  } finally {
    console.log('Response send successfully ');
  }
});

//loging
router.post('/login', async (req, res) => {
  try {
    const user = await User.find({ userName: req.body.userName });

    if (user && user.length > 0) {
      const isvalidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isvalidPassword) {
        // genarate token
        const token = jwt.sign(
          {
            userName: user[0].userName,
            userid: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h',
          }
        );
        res.status(200).json({
          access_token: token,
          message: `Log In Successful`,
        });
      } else {
        res.status(401).json({ error: 'Authentication failed' });
      }
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: `Authentication failed` });
  } finally {
    console.log('successfully send response');
  }
});

// get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({
      status: 'active',
    }).populate('todos');
    res.status(200).json({
      data: users,
      message: ` Success `,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `There's somthing wrong in server side`,
    });
  }
});

module.exports = router;

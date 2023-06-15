const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const todoSchema = require('./schemas/tododschema');
const userSchema = require('./schemas/userScehmas');
const { todo } = require('node:test');
const Todo = new mongoose.model('Todo', todoSchema);
const User = new mongoose.model('User', userSchema);
const checkLogin = require('../Middlewares/checkLogIn');

router.use(express.json());

// get all the methods
router.get('/get', checkLogin, async (req, res) => {
  try {
    let result;
    if (
      (result = await Todo.find({
        Title: '   Pakistan    ',
      })
        .populate('User', 'name userName status -_id')
        .select({
          _id: 0,
          _v: 0,
          date: 0,
        })
        .limit(2))
    ) {
      res.status(200).json({ result: result });
    } else {
      res.status(500).json({ error: ` Server side Problem` });
    }
  } catch (err) {
    res.status(401).send(` we cant find any todos because: ${err.message}`);
    console.log(err.message);
  } finally {
    console.log(`succcsfully send response `);
  }
});

// get a method
router.get('/one/:id', async (req, res) => {
  try {
    let result;
    if ((result = await Todo.findById({ _id: req.params.id }))) {
      res
        .status(200)
        .json({ result: result, message: `successfully get data` });
      console.log({ result: result });
    } else {
      res.status(500).json({ error: ` Server side problem ` });
    }
  } catch (err) {
    res.status(401).send(` we cant find todo because: ${err.message}`);
    console.log(err.message);
  } finally {
    console.log(`succcsfully send responese `);
  }
});

// post todo
router.post('/', checkLogin, async (req, res) => {
  try {
    const newTodo = new Todo({
      ...req.body,
      User: req.userid,
    });

    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userid,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );

    if (todo) {
      res.status(200).json({ message: `successfully saved todo data` });
    } else {
      res.status(500).json({ error: ` Server Side Problem` });
    }
  } catch (err) {
    res.status(401).send(`you can't  add because ${err.message}`);
    console.log(err.message);
  } finally {
    console.log(`succcsfully send response `);
  }
});
// post mutliple todo

router.post('/all', async (req, res) => {
  try {
    if (await Todo.insertMany(req.body)) {
      res.status(200).json({ message: `successfully saved todo data` });
    } else {
      res.status(500).json({ error: `Server Side Problem` });
    }
  } catch (err) {
    res.status(401).send(`you can't  add because ${err.message}`);
    console.log(err.message);
  } finally {
    console.log(`message: resoponse send for todos data`);
  }
});

// put to do
router.put('/:id', async (req, res) => {
  try {
    let result;
    if (
      (result = await Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            status: 'active',
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      ))
    ) {
      res
        .status(200)
        .json({ result: result, message: `successfully updated todos data` });
      console.log(result);
    } else {
      res.status(500).json({ error: `Server Side Problem` });
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
    console.log(err.message);
  } finally {
    console.log(`successfully send response`);
  }
});

// delete to do

router.delete('/:id', async (req, res) => {
  try {
    let result;
    if ((result = await Todo.findByIdAndDelete({ _id: req.params.id }))) {
      res
        .status(200)
        .json({ result: result, message: `successfully Deleted todo  ` });
      console.log({ result: result });
    } else {
      res.status(500).json({ error: `Server Side Problem` });
    }
  } catch (err) {
    res.status(401).send(` we cant delete todo because: ${err.message}`);
    console.log(err.message);
  } finally {
    console.log(`succcsfully send responese `);
  }
});

// get active todos using object

router.get('/active', async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    console.log('successfully send response ');
  }
});

// get active Todos  using model
router.get('/js', async (req, res) => {
  try {
    const data = await Todo.findByJs();
    res.status(200).json({ data: data });
    console.log(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    console.log('successfully send response ');
  }
});

// get active Todos  by Language
router.get('/language', async (req, res) => {
  try {
    const data = await Todo.find().byLanguage('react');
    res.status(200).json({ data: data });
    console.log(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    console.log('successfully send response ');
  }
});

module.exports = router;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchemas = Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
  },
  todos: [
    {
      type: Schema.Types.ObjectId,
      ref:'Todo'
    },
  ],
});

module.exports = userSchemas;

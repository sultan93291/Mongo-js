const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = Schema({
  Title: {
    type: String,
    required: true,
  },
  descreption: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

// instance method
todoSchema.methods = {
  findActive: function () {
    return mongoose.model('Todo').find({ status: 'active' });
  },
};

// static methods

todoSchema.statics = {
  findByJs: function () {
    return this.find({ Title: /Abib/i });
  },
};
// query helpers
todoSchema.query = {
  byLanguage: function (language) {
    return this.find({ Title: new RegExp(language, 'i') });
  },
};

module.exports = todoSchema;

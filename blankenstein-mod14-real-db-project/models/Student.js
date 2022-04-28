const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true, 'Please add your first name'],
    trim: true
  },
  lastName: {
    type: String,
    require: [true, 'Please add your first name'],
    trim: true
  },
  grade: {
    type: Number,
    required: [true, 'Please add your grade']
  },
  classes: Array
})

module.exports = mongoose.model('Student', StudentSchema)
const express = require('express')
const router = express.Router()

const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentClasses,
  updateStudentClasses,
  updateStudentClassesAll
} = require('../controllers/students')

router.route('/')
  .get(getStudents)
  .post(createStudent)

router.route('/:id') 
  .get(getStudent)
  .put(updateStudent)
  .delete(deleteStudent)

router.route('/:id/classes')
.get(getStudentClasses)
.put(updateStudentClasses)

router.route('/:id/classes/all')
  .put(updateStudentClassesAll)

module.exports = router
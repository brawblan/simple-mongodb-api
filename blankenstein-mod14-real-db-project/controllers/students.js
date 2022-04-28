const Student = require('../models/Student')

//  @desc   Get all students
//  @route  GET /api/v1/students
//  @access PUBLIC
exports.getStudents = async (req, res, next) => {
  const limitStudents = (students, limit) => {
    return students.splice(0, limit)
  }
  const ascOrDesc = (query, students) => {
    let x, y
    query === "asc" ? (x = 1) : (x = -1)
    query === "asc" ? (y = -1) : (y = 1)
  
    return students.sort((a, b) =>
      a.lastName > b.lastName
        ? x
        : a.lastName === b.lastName
        ? a.firstName > b.firstName
          ? x
          : y
        : y
    )
  }

  try {
    const students = await Student.find()

    // no queries, return all students
    if (!!!Object.values(req.query).length) {
      res.status(200).json({ success: true, count: students.length, data: students })
      return
    }
    
    // both limit and sorting
    if (req.query.limit && req.query.sort) {
      if ((!!req.query.limit && isNaN(req.query.limit)) && req.query.sort !== 'asc' && req.query.sort !== 'desc') {
        res.status(409).send({ error: true, message: 'Limit must be a number and sort must be "asc" or "desc"'})
        return  
      }
        const sorted = ascOrDesc(req.query.sort, students)
        const limit = parseInt(req.query.limit)
        res.status(200).send(limitStudents(sorted, limit))
        return
    }

    // only limit
    if (!!req.query.limit && !isNaN(req.query.limit)) {
      console.log('limited');
      const limit = parseInt(req.query.limit)
      res.status(200).send(limitStudents(students, limit))
      return
    } else if (!!req.query.limit && isNaN(req.query.limit)) {
      res.status(409).send({ error: true, message: 'Limit must be a number.'})
      return
    }
    if (req.query.sort) {
      res.status(200).send(ascOrDesc(req.query.sort, students))
      return
    }
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

//  @desc   Get single student
//  @route  GET /api/v1/students/:id
//  @access PUBLIC
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
    
    if (!student) {
      return res.status(400).json({ success: false })
    }
    
    res.status(200).json({ success: true, data: student })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

//  @desc   Create student
//  @route  POST /api/v1/student/:id
//  @access PRIVATE
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body)
    res.status(201).json({ success: true, data: student })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

//  @desc   Update single student
//  @route  PUT /api/v1/students/:id
//  @access PRIVATE
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!student) {
      return res.status(400).json({ success: false })
    }
    
    res.status(200).json({ success: true, data: student})
  } catch (error) {
    return res.status(400).json({ success: false })
  }
}

//  @desc   Delete single student
//  @route  DELETE /api/v1/students/:id
//  @access PRIVATE
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)
    
    if (!student) {
      return res.status(400).json({ success: false })
    }

    res.status(200).json({ sucess: true, data: {} })
  } catch (error) {
    return res.status(400).json({ success: false })
  }
}

// /* CLASSES CRUD [OPTIONAL] */
//  @desc   Get single student classes
//  @route  GET /api/v1/students/:id/classes
//  @access PUBLIC
exports.getStudentClasses = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
    
    if (!student) {
      return res.status(400).json({ success: false })
    }
    
    res.status(200).json({ success: true, data: student.classes })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

//  @desc   Update single student classes
//  @route  PUT /api/v1/students/:id/classes
//  @access PRIVATE
exports.updateStudentClasses = async (req, res, next) => {  
  try {
    const studentById = await Student.findById(req.params.id)
    const updatedClasses = [...studentById.classes]
    const add = req.body.add
    const remove = req.body.remove
  
    Object.values(add).map((item) => {
      if (updatedClasses.includes(item)) {
        return
      }
      updatedClasses.push(item)
    })
    Object.values(remove).map((item) => {
      if (!updatedClasses.includes(item)) {
        return res.status(409).send({ error: true, message: 'Student is not in this class.'})
      }
      const targetIndex = updatedClasses.indexOf(item)
      updatedClasses.splice(targetIndex, 1)
    })

    const student = await Student.findByIdAndUpdate(req.params.id, {classes: updatedClasses}, {
      new: true,
      runValidators: true
    })
    console.log(student, updatedClasses);

    if (!student) {
      return res.status(400).json({ success: false })
    }
    
    res.status(200).json({ success: true, data: student.classes })
  } catch (error) {
    return res.status(400).json({ success: false })
  }
}

//  @desc   Update all single student classes
//  @route  PUT /api/v1/students/:id/classes/all
//  @access PRIVATE
exports.updateStudentClassesAll = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!student) {
      return res.status(400).json({ success: false })
    }
    
    res.status(200).json({ success: true, data: student.classes })
  } catch (error) {
    return res.status(400).json({ success: false })
  }
}

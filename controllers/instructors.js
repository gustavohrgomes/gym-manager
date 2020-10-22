const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils/utils')

exports.index = (req, res) => {
  return res.render('instructors/index', { instructors: data.instructors })
}

exports.create = (req, res) =>{
  return res.render('instructors/create')
}

exports.post = (req, res) => {

  const keys = Object.keys(req.body)

  for (value of keys) {
    if (req.body[value] == "")
      return res.send("Please, fill in all fields")
  }

  let { avatar_url, name, birth, gender, services } = req.body

  birth = Date.parse(birth)
  const created_at = Date.now()
  const id = Number(data.instructors.length + 1)

  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
    if (err) return res.send("Write file error")

    return res.redirect(`/instructors/${id}`)
  })
}

exports.show = (req, res) => {
  const { id } = req.params

  const foundInsctructor = data.instructors.find(instructor => {
    return instructor.id == id
  })

  if (!foundInsctructor) return res.send("Instructor not found, sorry :(")

  const instructor = {
    ...foundInsctructor,
    age: age(foundInsctructor.birth),
    services: foundInsctructor.services.split(','),
    created_at: new Intl.DateTimeFormat("pt-BR").format(foundInsctructor.created_at)
  }

  return res.render('instructors/show', { instructor })
}

exports.edit = (req, res) => {
  const { id } = req.params

  const foundInsctructor = data.instructors.find(instructor => {
    return instructor.id == id
  })

  if (!foundInsctructor) return res.send("Instructor not found, sorry :(")

  const instructor = {
    ...foundInsctructor,
    birth: date(foundInsctructor.birth).iso
  }

  return res.render('instructors/edit', { instructor })
}

exports.put = (req, res) => {
  const { id } = req.body

  let index = 0

  const foundInsctructor = data.instructors.find((instructor, foundIndex) => {
    if (id == instructor.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundInsctructor) return res.send("Instructor not found, sorry :(")

  const instructor = {
    ...foundInsctructor,
    ...req.body,
    id: Number(req.body.id),
    birth: Date.parse(req.body.birth)
  }

  data.instructors[index] = instructor

  fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
    if (err) return res.send("write error!")

    return res.redirect(`/instructors/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  const filteredInstructors = data.instructors.filter(instructor => {
    return instructor.id != id;
  })

  data.instructors = filteredInstructors;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
    if (err) return res.send("Write File error!")

    return res.redirect('/instructors')
  })
}


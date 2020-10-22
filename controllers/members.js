const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils/utils')

exports.index = (req, res) => {
  return res.render('members/index', { members: data.members })
}

exports.show = (req, res) => {
  const { id } = req.params

  const foundMember = data.members.find(member => {
    return member.id == id
  })

  if (!foundMember) return res.send("Member not found, sorry :(")

  const member = {
    ...foundMember,
    age: age(foundMember.birth),
  }

  return res.render('members/show', { member })
}

exports.create = (req, res) =>{
  return res.render('members/create')
}

exports.post = (req, res) => {

  const keys = Object.keys(req.body)

  for (value of keys) {
    if (req.body[value] == "")
      return res.send("Please, fill in all fields")
  }

  birth = Date.parse(req.body.birth)

  let id = 1  
  const lastMember = data.members[data.members.length - 1]

  if (lastMember) {
    id = lastMember.id + 1
  }

  data.members.push({
    id,
    ...req.body,
    birth
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
    if (err) return res.send("Write file error")

    return res.redirect(`/members/${id}`)
  })
}

exports.edit = (req, res) => {
  const { id } = req.params

  const foundMember = data.members.find(member => {
    return member.id == id
  })

  if (!foundMember) return res.send("Instructor not found, sorry :(")

  const member = {
    ...foundMember,
    birth: date(foundMember.birth)
  }

  return res.render('members/edit', { member })
}

exports.put = (req, res) => {
  const { id } = req.body

  let index = 0

  const foundMember = data.members.find((member, foundIndex) => {
    if (id == member.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundMember) return res.send("Instructor not found, sorry :(")

  const member = {
    ...foundMember,
    ...req.body,
    id: Number(req.body.id),
    birth: Date.parse(req.body.birth)
  }

  data.members[index] = member

  fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
    if (err) return res.send("write error!")

    return res.redirect(`/members/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  const filteredMembers = data.members.filter(member => {
    return member.id != id;
  })

  data.members = filteredMembers;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
    if (err) return res.send("Write File error!")

    return res.redirect('/members')
  })
}


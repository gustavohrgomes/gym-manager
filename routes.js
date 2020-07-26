const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => {
  return res.redirect('/instructors')
})

routes.get('/instructors', (req, res) => {
  return res.render('instructors/index')
})

routes.get('/instructors/create', (req, res) =>{
  return res.render('instructors/create')
})

routes.post('/instructors', (req, res) =>{
  //req.query = /instructors/:id geralmente usado em requisições GET
  //req.body = É enviado atravez de um formulário no formato JSON, usado em requisições POST
  
  const keys = Object.keys(req.body)

  for (value of keys) {
    if (req.body[value] == "")
      return res.send("Please, fill in all fields")
  }

  return res.send(req.body)
})

routes.get('/members', (req, res) => {
  return res.send('members')
})

module.exports = routes
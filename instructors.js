const fs = require('fs')
const data = require('./data.json')
const { age } = require('./utils')

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
      created_at: ""
   }

   return res.render('instructors/show', { instructor })
}

exports.post = (req, res) =>{
   
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

   fs.writeFile( "data.json", JSON.stringify(data, null, 2), err => {
      if (err) return res.send("Write file error")
      
      return res.redirect('/instructors')
   })
}
const Instructor = require("../models/Instructor");

module.exports = {
  index(req, res) {
    Instructor.getAll(function (instructors) {
      return res.render("instructors/index", { instructors });
    });
  },
  create(req, res) {
    return res.render("instructors/create");
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == "") return res.send("Please, fill in all fields");
    }

    Instructor.create(req.body, function (instructor) {
      return res.redirect(`/instructors/${instructor.id}`);
    });
  },
  show(req, res) {
    return;
  },
  edit(req, res) {
    return;
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == "") return res.send("Please, fill in all fields");
    }

    return;
  },
  delete(req, res) {
    return;
  },
};

const { age, date } = require("../../lib/utils");

module.exports = {
  index(req, res) {
    return res.render("members/index");
  },
  create(req, res) {
    return res.render("members/create");
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == "") return res.send("Please, fill in all fields");
    }

    let { avatar_url, name, birth, gender, services } = req.body;

    return;
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

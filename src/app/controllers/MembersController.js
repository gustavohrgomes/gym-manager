const Member = require("../models/Member");
const { age, date } = require("../../lib/utils");

module.exports = {
  index(req, res) {
    Member.getAll(function (members) {
      return res.render("members/index", { members });
    });
  },
  create(req, res) {
    return res.render("members/create");
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == "") return res.send("Please, fill in all fields");
    }

    Member.create(req.body, function (member) {
      return res.redirect(`/members/${member.id}`);
    });
  },
  show(req, res) {
    Member.find(req.params.id, function (member) {
      if (!member) return res.send("Member not found!");

      member.birth = date(member.birth).birthDay;

      console.log(member.id);
      return res.render("members/show", { member });
    });
  },
  edit(req, res) {
    Member.find(req.params.id, function (member) {
      if (!member) return res.send("Member not found!");

      member.birth = date(member.birth).iso;

      return res.render("members/edit", { member });
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == "") return res.send("Please, fill in all fields");
    }

    Member.update(req.body, function () {
      return res.redirect(`/members/${req.body.id}`);
    });

    return;
  },
  delete(req, res) {
    Member.delete(req.body.id, function () {
      return res.redirect("/members");
    });
  },
};

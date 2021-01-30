const db = require("../../config/db");
const { age, date } = require("../../lib/utils");

module.exports = {
  getAll(callback) {
    const selectFromMember = `
      SELECT 
        id,
        name,
        avatar_url,
        email,
        birth,
        gender,
        blood,
        weight,
        height
      FROM 
        members
    `;

    db.query(selectFromMember, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  },
  create(member, callback) {
    const insertIntoMember = `
      INSERT INTO members (
        name,
        avatar_url,
        email,
        birth,
        gender,
        blood,
        weight,
        height,
        instructor_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const values = [
      member.name,
      member.avatar_url,
      member.email,
      date(member.birth).iso,
      member.gender,
      member.blood,
      member.weight,
      member.height,
      member.instructor,
    ];

    db.query(insertIntoMember, values, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0]);
    });
  },
  find(id, callback) {
    const selectFromMember = `
      SELECT
        members.id,
        members.name,
        members.avatar_url,
        members.email,
        members.birth,
        members.gender,
        members.blood,
        members.weight,
        members.height,
        instructors.name AS instructor_name
      FROM 
        members
      LEFT JOIN instructors
      ON members.instructor_id = instructors.id
      WHERE 
        members.id = $1
    `;

    db.query(selectFromMember, [id], function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0]);
    });
  },
  update(member, callback) {
    const update = `
      UPDATE members 
      SET
        name = ($1),
        avatar_url = ($2),
        email = ($3),
        birth = ($4),
        gender = ($5),
        blood = ($6),
        weight = ($7),
        height = ($8),
        instructor_id = ($9)
      WHERE 
        id = $10
    `;

    const values = [
      member.name,
      member.avatar_url,
      member.email,
      date(member.birth).iso,
      member.gender,
      member.blood,
      member.weight,
      member.height,
      member.instructor,
      member.id,
    ];

    db.query(update, values, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0]);
    });
  },
  delete(id, callback) {
    const deleteMember = `DELETE FROM members WHERE id = $1`;

    db.query(deleteMember, [id], function (err, results) {
      if (err) throw `Database Error! ${err}`;

      return callback();
    });
  },
  instructorsSelectOptions(callback) {
    const instructorOptions = "SELECT id, name FROM instructors";

    db.query(instructorOptions, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      return callback(results.rows);
    });
  },
};

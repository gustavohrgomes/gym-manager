const db = require("../../config/db");
const { age, date } = require("../../lib/utils");

module.exports = {
  getAll(callback) {
    const selectFromInstructors = `
      SELECT 
        id,
        name,
        avatar_url,
        gender,
        services,
        birth,
        created_at
      FROM 
        instructors
    `;

    db.query(selectFromInstructors, function (err, results) {
      if (err) return res.send("Database Error!");

      callback(results.rows);
    });
  },
  create(instructor, callback) {
    const insertIntoInstructors = `
      INSERT INTO instructors (
        name,
        avatar_url,
        gender,
        services,
        birth,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      instructor.name,
      instructor.avatar_url,
      instructor.gender,
      instructor.services,
      date(instructor.birth).iso,
      date(Date.now()).iso,
    ];

    db.query(insertIntoInstructors, values, function (err, results) {
      if (err) return res.send("Database Error!");

      callback(results.rows[0]);
    });
  },
};

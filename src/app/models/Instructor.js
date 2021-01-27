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
        birth,
        gender,
        services,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      instructor.name,
      instructor.avatar_url,
      date(instructor.birth).iso,
      instructor.gender,
      instructor.services,
      date(Date.now()).iso,
    ];

    db.query(insertIntoInstructors, values, function (err, results) {
      if (err) return res.send("Database Error!");

      callback(results.rows[0]);
    });
  },
  find(id, callback) {
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
      WHERE 
        id = $1
    `;

    db.query(selectFromInstructors, [id], function (err, results) {
      if (err) return res.send("Database Error!");

      callback(results.rows[0]);
    });
  },
  update(instructor, callback) {
    const update = `
      UPDATE instructors 
      SET
        name = ($1),
        avatar_url = ($2),
        birth = ($3),
        gender = ($4),
        services = ($5)
      WHERE 
        id = $6
    `;

    const values = [
      instructor.name,
      instructor.avatar_url,
      date(instructor.birth).iso,
      instructor.gender,
      instructor.services,
      instructor.id,
    ];

    db.query(update, values, function (err, results) {
      if (err) return res.send("Database Error!");

      callback(results.rows[0]);
    });
  },
};

const db = require("../../config/db");
const { age, date } = require("../../lib/utils");

module.exports = {
  getAll(callback) {
    const selectFromInstructors = `
      SELECT 
        instructors.id,
        instructors.name,
        instructors.avatar_url,
        instructors.gender,
        instructors.services,
        instructors.birth,
        instructors.created_at,
        COUNT(members) as total_students
      FROM 
        instructors
      LEFT JOIN members ON members.instructor_id = instructors.id
      GROUP BY instructors.id
      ORDER BY total_students DESC 
    `;

    db.query(selectFromInstructors, function (err, results) {
      if (err) throw `Database Error! ${err}`;

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
      if (err) throw `Database Error! ${err}`;

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
      if (err) throw `Database Error! ${err}`;

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
      if (err) throw `Database Error! ${err}`;

      callback(results.rows[0]);
    });
  },
  delete(id, callback) {
    const deleteInstructor = `DELETE FROM instructors WHERE id = $1`;

    db.query(deleteInstructor, [id], function (err, results) {
      if (err) throw `Database Error! ${err}`;

      return callback();
    });
  },
  filterInstructors(filter, callback) {
    const filterInstructors = `
      SELECT 
        instructors.id,
        instructors.name,
        instructors.avatar_url,
        instructors.gender,
        instructors.services,
        instructors.birth,
        instructors.created_at,
        COUNT(members) as total_students
      FROM 
        instructors
      LEFT JOIN members ON members.instructor_id = instructors.id
      WHERE instructors.name ILIKE '%${filter}%' OR instructors.services ILIKE '%${filter}%'
      GROUP BY instructors.id
      ORDER BY total_students DESC 
    `;

    db.query(filterInstructors, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params;

    let query = "";
    filterQuery = "";
    totalQuery = `(SELECT count(*) FROM instructors) AS TOTAL`;

    if (filter) {
      filterQuery = `${query}
        WHERE instructors.name ILIKE '%${filter}%' 
        OR instructors.services ILIKE '%${filter}%'
      `;

      totalQuery = `(
        SELECT count(*) FROM instructors
        ${filterQuery}
      ) AS Total`;
    }

    query = `
      SELECT
        instructors.id,
        instructors.name,
        instructors.avatar_url,
        instructors.gender,
        instructors.services,
        instructors.birth,
        instructors.created_at,
        ${totalQuery},
        COUNT(members) as total_students
      FROM
        instructors
      LEFT JOIN members ON instructors.id = members.instructor_id
      ${filterQuery}
      GROUP BY instructors.id
      ORDER BY total_students DESC
      LIMIT $1 OFFSET $2
    `;

    db.query(query, [limit, offset], function (err, results) {
      console.log(query);
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
      console.log(results.rows);
    });
  },
};

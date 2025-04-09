import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kind_spark'
});

db.connect(function (err) {
  if (err) throw err;
  console.log('Connected to MySQL, good job!');
});

export default db;
console.log('Hi, pasimatome su tavimi pirma karta! How are you?');

import { faker } from '@faker-js/faker';
import { createSome, createUser } from './user.js';
import { createStory } from './story.js';
import { createDonation } from './donation.js';
import mysql from 'mysql';

const usersCount = 10;
const storiesCount = 15;

const users = faker.helpers.multiple(createUser, {
  count: usersCount - 2
});
users.push(
  createSome('Bebras', 'admin'),
  createSome('Barsukas', 'user')
);

const stories = faker.helpers.multiple(createStory, {
  count: storiesCount
});


const donations = [];

stories.forEach((s, key) => {
  s.user_id = faker.number.int({ min: 1 , max: usersCount });
  const storyId = key + 1;
  const donationsCount = faker.number.int({ min: 1 , max: 10 });

  for (let i = 0; i < donationsCount; i++) {
    donations.push(createDonation(storyId));
  };
});


const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kind_spark'
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

let sql;

sql = 'DROP TABLE IF EXISTS donations';
con.query(sql, (err) => {
  if (err) {
    console.log('NOPE Donations table drop error', err);
  } else {
    console.log('OK Donations table was dropped');
  }
});

sql = 'DROP TABLE IF EXISTS sessions';
con.query(sql, (err) => {
  if (err) {
    console.log('NOPE Sessions table drop error', err);
  } else {
    console.log('OK Sessions table was dropped');
  }
});

sql = 'DROP TABLE IF EXISTS stories';
con.query(sql, (err) => {
  if (err) {
    console.log('NOPE Stories table drop error', err);
  } else {
    console.log('OK Stories table was dropped');
  }
});

sql = 'DROP TABLE IF EXISTS users';
con.query(sql, (err) => {
  if (err) {
    console.log('NOPE Users table drop error', err);
  } else {
    console.log('OK Users table was dropped');
  }
});

sql = `
  CREATE TABLE users (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    username CHAR(100) NOT NULL UNIQUE,
    password CHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin','user') NOT NULL DEFAULT 'user',
    avatar TEXT DEFAULT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB;
`;

con.query(sql, (err) => {
  if (err) {
    console.log('NOPE Users table create error', err);
  } else {
    console.log('OK Users table was created');
  }
});

sql = `
  CREATE TABLE stories (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    image TEXT DEFAULT NULL,
    description TEXT NOT NULL,
    user_id INT(10) UNSIGNED DEFAULT NULL,
    goal_amount INT NOT NULL,
    current_amount INT NOT NULL DEFAULT 0,
    status ENUM('pending', 'approved', 'disapproved', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB;
`;

con.query(sql, (err) => {
  if (err) {
    console.log('NOPE ERROR creating stories table:', err);
  } else {
    console.log('OK Stories table created');
  }
});

sql = `
  CREATE TABLE donations (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    story_id INT(10) UNSIGNED,
    donor_name VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT(10) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`;

con.query(sql, (err) => {
  if (err) {
    console.log('NOPE ERROR creating donations table:', err);
  } else {
    console.log('OK Donations table created');
  }
});

sql = `
  CREATE TABLE sessions (
    id INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT(10) UNSIGNED NOT NULL,
    token CHAR(32) NOT NULL,
    valid_until DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;
con.query(sql, (err) => {
  if (err) {
    console.log('NOPE Sessions table create error', err);
  } else {
    console.log('OK Sessions table was created');
  }
});

sql = `
  INSERT INTO users
  (username, password, email, role, avatar) 
  VALUES ?
`;
const userValues = users.map(user => [
  user.username,
  user.password,
  user.email,
  user.role,
  user.avatar
]);
con.query(sql, [userValues], (err, result) => {
  if (err) {
    console.log('NOPE Insert users error:', err);
  } else {
    console.log(`OK ${result.affectedRows} users inserted!`);
  }
});


sql = `
  INSERT INTO stories 
  (title, description, goal_amount, current_amount, image, status, user_id, created_at) 
  VALUES ?
`;
const storyValues = stories.map(story => [
  story.title,
  story.description,
  story.goal_amount,
  story.current_amount,
  story.image,
  story.status,
  story.user_id,
  story.created_at
]);

con.query(sql, [storyValues], (err, result) => {
  if (err) {
    console.log('NOPE ERROR inserting stories:', err);
  } else {
    console.log(`OK ${result.affectedRows} stories inserted!`);
  }
});

sql = `
  INSERT INTO donations
  (donor_name, amount, story_id, created_at, user_id)
  VALUES ?
`;
const donationValues = donations.map(donation => [
  donation.donor_name,
  donation.amount,
  donation.story_id,
  donation.created_at,
  donation.user_id
]);
con.query(sql, [donationValues], (err, result) => {
  if (err) {
    console.log('NOPE ERROR inserting donations:', err);
  } else {
    console.log(`OK ${result.affectedRows} donations inserted!`);
  }
});

con.end(err => {
  if (err) {
    console.log('Error closing MySQL:', err);
  } else {
    console.log('Database connection closed, nice!');
  }
});

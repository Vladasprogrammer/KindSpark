console.log('Hi, pasimatome su tavimi pirma karta! How are you?');

import { faker } from '@faker-js/faker';
import { createUser } from './user.js';
import { createStory } from './story.js';
import { createDonation } from './donation.js';
import db from '../backend/db.js';

const usersCount = 5;
const storiesCount = 10;
const donationsCount = 30;

const users = faker.helpers.multiple(createUser, {
  count: usersCount
});
const stories = faker.helpers.multiple(createStory, {
  count: storiesCount
});
const donations = faker.helpers.multiple(createDonation, {
  count: donationsCount
});

let sql;

sql = 'DROP TABLE IF EXISTS donations';
db.query(sql, (err) => {
  if (err) {
    console.log('NOPE Donations table drop error', err);
  } else {
    console.log('OK Donations table was dropped');
  }
});

sql = 'DROP TABLE IF EXISTS sessions';
db.query(sql, (err) => {
  if (err) {
    console.log('NOPE Sessions table drop error', err);
  } else {
    console.log('OK Sessions table was dropped');
  }
});

sql = 'DROP TABLE IF EXISTS stories';
db.query(sql, (err) => {
  if (err) {
    console.log('NOPE Stories table drop error', err);
  } else {
    console.log('OK Stories table was dropped');
  }
});

sql = 'DROP TABLE IF EXISTS users';
db.query(sql, (err) => {
  if (err) {
    console.log('NOPE Users table drop error', err);
  } else {
    console.log('OK Users table was dropped');
  }
});

sql = `
  CREATE TABLE users (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    name CHAR(100) NOT NULL UNIQUE,
    password CHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin','user') NOT NULL DEFAULT 'user',
    avatar TEXT DEFAULT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB;
`;

db.query(sql, (err) => {
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
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB;
`;

db.query(sql, (err) => {
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

db.query(sql, (err) => {
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
db.query(sql, (err) => {
  if (err) {
    console.log('Sessions table create error', err);
  } else {
    console.log('Sessions table was created');
  }
});

sql = `
  INSERT INTO users
  (name, password, email, role, avatar) 
  VALUES ?
`;
const userValues = users.map(user => [
  user.username,
  user.password,
  user.email,
  user.role,
  user.avatar
]);
db.query(sql, [userValues], (err, result) => {
  if (err) {
    console.log('NOPE Insert users error:', err);
  } else {
    console.log(`OK ${result.affectedRows} users inserted!`);

    sql = `
      INSERT INTO stories 
      (title, description, goal_amount, current_amount, image, status, user_id) 
      VALUES ?
    `;
    const storyValues = stories.map(story => [
      story.title,
      story.description, 
      story.goal_amount,
      story.current_amount,
      story.image,
      story.status,
      story.user_id
    ]);
    db.query(sql, [storyValues], (err, result) => {
      if (err) {
        console.log('NOPE ERROR inserting stories:', err);
      } else {
        console.log(`OK ${result.affectedRows} stories inserted!`);

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
        db.query(sql, [donationValues], (err, result) => {
          if (err) {
            console.log('NOPE ERROR inserting donations:', err);
          } else {
            console.log(`OK ${result.affectedRows} donations inserted!`);
          }

          db.end(err => {
            if (err) {
              console.log('Error closing MySQL:', err);
            } else {
              console.log('Database connection closed, nice!');
            }
          });
        });
      }
    });
  }
});
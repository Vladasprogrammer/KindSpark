import { faker } from '@faker-js/faker';
import md5 from 'md5';

export function createUser() {
  
  return {
    username: faker.internet.username(),
    password: md5('123'),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['user', 'admin']),
    avatar: faker.image.avatar(),
  };
}

export function createSome(name, role) {
  return {
    username: name,
    password: md5('123'),
    email: name + '@gmail.com',
    role: role,
    avatar: faker.image.avatar(),
  };
}
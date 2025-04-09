import { faker } from '@faker-js/faker';
import md5 from 'md5';

export function createSession(userId) {
  return {
    user_id: userId,
    token: md5(faker.datatype.uuid()),
    valid_until: faker.date.future()
  };
}

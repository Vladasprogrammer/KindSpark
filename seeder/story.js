import { faker } from "@faker-js/faker";

export function createStory() {

  return {
    title: faker.lorem.sentence({ min: 2, max: 7 }),
    description: faker.lorem.paragraph(),
    goal_amount: faker.number.int({ min: 100, max: 999999999 }),
    current_amount: 0,
    image: faker.image.url(),
    status: faker.helpers.arrayElement(['']),
    // user_id: faker.number.int({ min: 1, max: 5 }),
    created_at: faker.date.past()
  };
}

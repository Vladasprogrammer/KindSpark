import { faker } from "@faker-js/faker";

export function createStory() {

  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    goal_amount: faker.number.int({ min: 100, max: 10000 }),
    current_amount: 0,
    image: faker.image.urlLoremFlickr({ category: 'charity' }),
    status: 'active',
    user_id: faker.number.int({ min: 1, max: 5 })
  };
}

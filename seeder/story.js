import { faker } from "@faker-js/faker";

export function createStory() {

  return {
    title: faker.lorem.sentence({ min: 2, max: 7 }),
    description: faker.lorem.paragraph(),
    goal_amount: faker.number.int({ min: 100, max: 999999999 }),
    current_amount: 0,
    image: faker.image.urlPicsumPhotos({ width: 1920, height: 1080, blur: 0, grayscale: false}),
    status: faker.helpers.arrayElement(['pending', 'approved', 'disapproved', 'completed']),
    created_at: faker.date.past()
  };
}

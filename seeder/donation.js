import { faker } from "@faker-js/faker";

export function createDonation(approvedStoryIds) {
  const storyId = faker.helpers.arrayElement(approvedStoryIds)
  return {
    donor_name: faker.person.firstName(),
    amount: faker.number.int({ min: 5, max: 500 }),
    story_id: storyId,
    created_at: faker.date.recent(),
    user_id: faker.number.int({ min: 1, max: 5 })
  };
}

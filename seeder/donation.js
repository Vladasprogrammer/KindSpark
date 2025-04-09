import { faker } from "@faker-js/faker";

export function createDonation() {

  return {
    donor_name: faker.person.firstName(),
    amount: faker.number.int({ min: 5, max: 500 }),
    story_id: faker.number.int({ min: 1, max: 10 }),
    created_at: faker.date.recent()
  };
}

import { people } from "./people"

// Let's choose Lucy Pearl as our current user
export const currentUser = people.find((person) => person.id === "81c842a6-7c60-419f-b47a-cfef021bbeaa")!

export function getCurrentUser() {
  return currentUser
}

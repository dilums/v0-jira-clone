export const projects = [
  {
    id: "8c243d74-0615-452f-a37e-07d38e624d8d",
    name: "Platform Revamp",
    description: "A major overhaul of the core platform to improve scalability and modularity.",
    ownerId: "a7b20f9a-8eab-4d9e-9a70-be92725534b7",
    status: "Archived",
    startDate: "2025-03-23",
    endDate: "2025-09-12",
    imageURL:"https://res.cloudinary.com/ds574fco0/image/upload/v1753844707/mock/revamp_iqcvlz.png",
    team: "qa",
  },
  {
    id: "07113d63-4ec3-4bb5-83d7-3acdcd306140",
    name: "Customer Dashboard",
    description: "Customer-facing dashboard for analytics, reports, and real-time metrics.",
    ownerId: "1c69892e-7912-4aef-80a0-4dbd540aa2cc",
    status: "Planning",
    startDate: "2025-04-15",
    endDate: "2025-10-22",
    imageURL:"https://res.cloudinary.com/ds574fco0/image/upload/v1753844707/mock/customer_i8fnr5.png",
    team: "marketing",
  },
  {
    id: "09424017-5a4b-422b-8dde-93e0999d6dc0",
    name: "Team Management Suite",
    description: "Admin tools for managing users, roles, teams, and organization structure.",
    ownerId: "680b6fac-b5c0-4cc6-bf7c-ce70a426fd21",
    status: "Archived",
    startDate: "2025-04-05",
    endDate: "2025-09-02",
    imageURL:"https://res.cloudinary.com/ds574fco0/image/upload/v1753844707/mock/team_brirwy.png",
    team: "product",
  },
  {
    id: "68d76e16-21c3-43bd-9de3-e5d6ae49f993",
    name: "Marketing Site Redesign",
    description: "A responsive redesign of the marketing website for better lead capture.",
    ownerId: "a931e382-f728-4ef9-aa6b-a39ee2ab1bd7",
    status: "Planning",
    startDate: "2025-02-07",
    endDate: "2025-09-15",
    imageURL:"https://res.cloudinary.com/ds574fco0/image/upload/v1753844707/mock/marketing_runrac.png",
    team: "product",
  },
  {
    id: "5a5fc0a6-5ec0-4340-818b-b8a3a42dd583",
    name: "Internal Tools Overhaul",
    description: "Cleanup and modernization of internal admin tools and workflows.",
    ownerId: "af0a3b37-dd50-478c-be1c-e73c5571b67a",
    status: "Active",
    startDate: "2025-07-14",
    endDate: "2025-08-17",
    imageURL:"https://res.cloudinary.com/ds574fco0/image/upload/v1753844706/mock/tools_oexp5l.png",
    team: "dev",
  },
]

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id)
}

export function getProjectsByTeam(team: string) {
  return projects.filter((project) => project.team === team)
}

export function getProjectsByStatus(status: string) {
  return projects.filter((project) => project.status === status)
}

export function getProjectsByOwner(ownerId: string) {
  return projects.filter((project) => project.ownerId === ownerId)
}

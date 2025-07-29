export const issues = [
  {
    id: "2bcc688e-cc79-4c95-81be-db7f3b437365",
    title: "Fix broken login redirect flow",
    description: "Users are experiencing a broken redirect after logging in. Investigate auth flow and router logic.",
    status: "To Do",
    priority: "Medium",
    storyPoints: 9,
    assigneeId: "81c842a6-7c60-419f-b47a-cfef021bbeaa",
    projectId: "09424017-5a4b-422b-8dde-93e0999d6dc0",
    createdAt: "2025-02-05T10:32:51",
    updatedAt: "2025-07-24T10:07:44",
  },
  {
    id: "1225bd07-1f4c-4de2-8eeb-ca09226a101a",
    title: "Improve performance on dashboard graphs",
    description: "Dashboard graphs lag on large datasets. Explore chart rendering or data aggregation issues.",
    status: "In Progress",
    priority: "Critical",
    storyPoints: 2,
    assigneeId: "680b6fac-b5c0-4cc6-bf7c-ce70a426fd21",
    projectId: "07113d63-4ec3-4bb5-83d7-3acdcd306140",
    createdAt: "2025-07-16T03:28:18",
    updatedAt: "2025-07-05T00:27:56",
  },
  {
    id: "a8977171-75c0-4dad-8dba-25366a2e5b12",
    title: "Implement drag-and-drop on Kanban",
    description: "Enable drag-and-drop interaction between columns on the Kanban board.",
    status: "In Progress",
    priority: "Medium",
    storyPoints: 6,
    assigneeId: "af0a3b37-dd50-478c-be1c-e73c5571b67a",
    projectId: "68d76e16-21c3-43bd-9de3-e5d6ae49f993",
    createdAt: "2025-03-21T00:25:12",
    updatedAt: "2025-07-01T18:41:05",
  },
  {
    id: "f7ecc84b-75e5-4822-bf3c-0900112d0557",
    title: "Resolve issue with timezone conversion",
    description:
      "Some users report incorrect due dates due to timezone misalignment. Validate server/client conversion.",
    status: "To Do",
    priority: "Critical",
    storyPoints: 6,
    assigneeId: "13343295-5d4a-4b16-9eaf-3d7fd129424e",
    projectId: "68d76e16-21c3-43bd-9de3-e5d6ae49f993",
    createdAt: "2025-01-30T07:51:28",
    updatedAt: "2025-07-19T12:11:56",
  },
  {
    id: "279ba878-5e3f-48a9-be12-b4cbf3a6f7b3",
    title: "Add dark mode toggle to navbar",
    description: "Add a dark/light toggle and persist theme preference in local storage.",
    status: "Done",
    priority: "Critical",
    storyPoints: 13,
    assigneeId: "81c842a6-7c60-419f-b47a-cfef021bbeaa",
    projectId: "68d76e16-21c3-43bd-9de3-e5d6ae49f993",
    createdAt: "2025-01-29T04:54:27",
    updatedAt: "2025-07-23T08:22:00",
  },
  {
    id: "088df4ed-91c7-470e-9e48-35cd37aae9c6",
    title: "Optimize API payloads for team data",
    description: "Reduce unused fields in API payload for team-related queries.",
    status: "Blocked",
    priority: "High",
    storyPoints: 3,
    assigneeId: "680b6fac-b5c0-4cc6-bf7c-ce70a426fd21",
    projectId: "68d76e16-21c3-43bd-9de3-e5d6ae49f993",
    createdAt: "2025-01-11T13:59:16",
    updatedAt: "2025-07-04T15:10:44",
  },
  {
    id: "b8977171-75c0-4dad-8dba-25366a2e5b13",
    title: "Update user profile validation logic",
    description: "Enhance form validation for user profile updates with better error handling.",
    status: "In Progress",
    priority: "Medium",
    storyPoints: 5,
    assigneeId: "81c842a6-7c60-419f-b47a-cfef021bbeaa",
    projectId: "07113d63-4ec3-4bb5-83d7-3acdcd306140",
    createdAt: "2025-01-15T09:30:00",
    updatedAt: "2025-01-28T14:20:00",
  },
  {
    id: "c8977171-75c0-4dad-8dba-25366a2e5b14",
    title: "Implement real-time notifications",
    description: "Add WebSocket support for real-time notifications across the application.",
    status: "To Do",
    priority: "High",
    storyPoints: 8,
    assigneeId: "81c842a6-7c60-419f-b47a-cfef021bbeaa",
    projectId: "09424017-5a4b-422b-8dde-93e0999d6dc0",
    createdAt: "2025-01-20T11:45:00",
    updatedAt: "2025-01-25T16:30:00",
  },
  {
    id: "d8977171-75c0-4dad-8dba-25366a2e5b15",
    title: "Refactor authentication middleware",
    description: "Clean up and optimize the authentication middleware for better performance.",
    status: "Done",
    priority: "Low",
    storyPoints: 3,
    assigneeId: "81c842a6-7c60-419f-b47a-cfef021bbeaa",
    projectId: "5a5fc0a6-5ec0-4340-818b-b8a3a42dd583",
    createdAt: "2025-01-10T08:15:00",
    updatedAt: "2025-01-22T10:45:00",
  },
]

export function getIssueById(id: string) {
  return issues.find((issue) => issue.id === id)
}

export function getIssuesByProject(projectId: string) {
  return issues.filter((issue) => issue.projectId === projectId)
}

export function getIssuesByAssignee(assigneeId: string) {
  return issues.filter((issue) => issue.assigneeId === assigneeId)
}

export function getIssuesByStatus(status: string) {
  return issues.filter((issue) => issue.status === status)
}

export function getIssuesByPriority(priority: string) {
  return issues.filter((issue) => issue.priority === priority)
}

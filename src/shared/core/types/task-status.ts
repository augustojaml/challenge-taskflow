const TASK_STATUS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const
type TaskStatus = (typeof TASK_STATUS)[number]

export { TASK_STATUS, type TaskStatus }

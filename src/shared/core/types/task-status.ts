const TASK_STATUS = ['IN_PROGRESS', 'PENDING', 'COMPLETED'] as const
type TaskStatus = (typeof TASK_STATUS)[number]

export { TASK_STATUS, type TaskStatus }

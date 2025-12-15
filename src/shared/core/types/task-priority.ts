const TASK_PRIORITY = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
type TaskPriority = (typeof TASK_PRIORITY)[number]

export { TASK_PRIORITY, type TaskPriority }

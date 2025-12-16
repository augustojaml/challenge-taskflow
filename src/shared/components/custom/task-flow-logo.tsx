const TaskFlowLogo = () => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="bg-primary text-primary-foreground relative flex h-8 w-8 items-center justify-center rounded-xl shadow-md">
        <div className="absolute h-4 w-2 rotate-45 border-r-2 border-b-2 border-current" />
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-tight">
          Task<span className="text-primary">Flow</span>
        </span>
        <span className="text-muted-foreground text-xs">task management</span>
      </div>
    </div>
  )
}

export { TaskFlowLogo }

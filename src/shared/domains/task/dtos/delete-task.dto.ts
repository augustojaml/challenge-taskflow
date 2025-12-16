type DeleteTaskParamsDto = {
  id: string
  userId: string
}

const toDeleteTaskResponseDto = () => {
  return {
    message: 'Task deleted successfully',
  }
}

type DeleteTaskResponseDto = ReturnType<typeof toDeleteTaskResponseDto>

export {
  type DeleteTaskParamsDto,
  type DeleteTaskResponseDto,
  toDeleteTaskResponseDto,
}

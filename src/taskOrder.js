export const COMPLETED_MOVE_DELAY_MS = 10_000

export function orderTasks(tasks, movedTaskIds) {
  const originalPositions = new Map(tasks.map((task, index) => [task.id, index]))

  return [...tasks].sort((firstTask, secondTask) => {
    const firstIsMoved = movedTaskIds.has(firstTask.id)
    const secondIsMoved = movedTaskIds.has(secondTask.id)

    if (firstIsMoved !== secondIsMoved) {
      return firstIsMoved ? 1 : -1
    }

    return originalPositions.get(firstTask.id) - originalPositions.get(secondTask.id)
  })
}

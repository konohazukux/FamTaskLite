import { useMemo, useState } from 'react'
import { getTodayKey, readCheckedTaskIds, writeCheckedTaskIds } from './checkStorage.js'
import { TASKS, USERS } from './tasks.js'

const weekdayFormatter = new Intl.DateTimeFormat('ja-JP', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
})

function TaskColumn({ user, tasks, checkedIds, onToggle }) {
  const completedCount = tasks.filter((task) => checkedIds.has(task.id)).length

  return (
    <section className={`task-column task-column--${user.tone}`} aria-labelledby={`${user.id}-title`}>
      <div className="column-heading">
        <div className="person">
          <span className="person-emoji" aria-hidden="true">{user.emoji}</span>
          <h2 id={`${user.id}-title`}>{user.name}</h2>
        </div>
        <div className="progress" aria-label={`${tasks.length}個中${completedCount}個完了`}>
          <strong>{completedCount}</strong>
          <span>/ {tasks.length}</span>
        </div>
      </div>

      <div className="task-list">
        {tasks.map((task) => {
          const isChecked = checkedIds.has(task.id)

          return (
            <button
              className={`task-card${isChecked ? ' task-card--checked' : ''}`}
              type="button"
              key={task.id}
              aria-pressed={isChecked}
              onClick={() => onToggle(task.id)}
            >
              <span className="task-emoji" aria-hidden="true">{task.emoji}</span>
              <span className="task-title">{task.title}</span>
              <span className="check-mark" aria-hidden="true">{isChecked ? '✓' : ''}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function App() {
  const [today] = useState(() => new Date())
  const [todayKey] = useState(() => getTodayKey(today))
  const [checkedIds, setCheckedIds] = useState(() => new Set(readCheckedTaskIds(localStorage, todayKey)))

  const tasksByUser = useMemo(
    () => Object.fromEntries(USERS.map((user) => [user.id, TASKS.filter((task) => task.userId === user.id)])),
    [],
  )

  function toggleTask(taskId) {
    setCheckedIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (nextIds.has(taskId)) {
        nextIds.delete(taskId)
      } else {
        nextIds.add(taskId)
      }

      writeCheckedTaskIds(localStorage, todayKey, [...nextIds])
      return nextIds
    })
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">TODAY'S TASKS</p>
          <h1>FamTask <span>Lite</span></h1>
        </div>
        <time dateTime={todayKey}>{weekdayFormatter.format(today)}</time>
      </header>

      <div className="columns" aria-label="今日のタスク一覧">
        {USERS.map((user) => (
          <TaskColumn
            key={user.id}
            user={user}
            tasks={tasksByUser[user.id]}
            checkedIds={checkedIds}
            onToggle={toggleTask}
          />
        ))}
      </div>
    </main>
  )
}

export default App

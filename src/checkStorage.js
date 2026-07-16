export const STORAGE_KEY = 'famtask-lite-checks'

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function readCheckedTaskIds(storage, today = getTodayKey()) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY))

    if (saved?.date === today && Array.isArray(saved.checkedTaskIds)) {
      return saved.checkedTaskIds.filter((id) => typeof id === 'string')
    }
  } catch {
    // 壊れた保存データは当日の空データで安全に置き換える。
  }

  writeCheckedTaskIds(storage, today, [])
  return []
}

export function writeCheckedTaskIds(storage, date, checkedTaskIds) {
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      date,
      checkedTaskIds,
    }),
  )
}

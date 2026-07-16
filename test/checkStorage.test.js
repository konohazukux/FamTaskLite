import test from 'node:test'
import assert from 'node:assert/strict'
import {
  STORAGE_KEY,
  getTodayKey,
  readCheckedTaskIds,
  writeCheckedTaskIds,
} from '../src/checkStorage.js'

function createStorage(initialValue = null) {
  let value = initialValue
  return {
    getItem: () => value,
    setItem: (_key, nextValue) => {
      value = nextValue
    },
    value: () => value,
  }
}

test('ローカル日付をYYYY-MM-DD形式で返す', () => {
  assert.equal(getTodayKey(new Date(2026, 6, 16, 23, 59)), '2026-07-16')
})

test('同日のチェック状態を読み込む', () => {
  const storage = createStorage(
    JSON.stringify({ date: '2026-07-16', checkedTaskIds: ['miku-chopsticks'] }),
  )
  assert.deepEqual(readCheckedTaskIds(storage, '2026-07-16'), ['miku-chopsticks'])
})

test('日付が変わると当日の空データにリセットする', () => {
  const storage = createStorage(
    JSON.stringify({ date: '2026-07-15', checkedTaskIds: ['koharu-piano'] }),
  )
  assert.deepEqual(readCheckedTaskIds(storage, '2026-07-16'), [])
  assert.deepEqual(JSON.parse(storage.value()), {
    date: '2026-07-16',
    checkedTaskIds: [],
  })
})

test('指定形式で保存する', () => {
  const storage = createStorage()
  writeCheckedTaskIds(storage, '2026-07-16', ['koharu-piano'])
  assert.equal(
    storage.value(),
    JSON.stringify({ date: '2026-07-16', checkedTaskIds: ['koharu-piano'] }),
  )
  assert.equal(STORAGE_KEY, 'famtask-lite-checks')
})

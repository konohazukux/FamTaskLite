import test from 'node:test'
import assert from 'node:assert/strict'
import { COMPLETED_MOVE_DELAY_MS, orderTasks } from '../src/taskOrder.js'

const tasks = [
  { id: 'first' },
  { id: 'second' },
  { id: 'third' },
  { id: 'fourth' },
]

test('移動対象になったタスクを一覧の末尾へ移動する', () => {
  assert.deepEqual(
    orderTasks(tasks, new Set(['second'])).map((task) => task.id),
    ['first', 'third', 'fourth', 'second'],
  )
})

test('複数の移動済みタスクは元の相対順を保つ', () => {
  assert.deepEqual(
    orderTasks(tasks, new Set(['first', 'third'])).map((task) => task.id),
    ['second', 'fourth', 'first', 'third'],
  )
})

test('移動対象から外すと元の並びへ戻る', () => {
  assert.deepEqual(
    orderTasks(tasks, new Set()).map((task) => task.id),
    ['first', 'second', 'third', 'fourth'],
  )
})

test('移動待ち時間は10秒', () => {
  assert.equal(COMPLETED_MOVE_DELAY_MS, 10_000)
})

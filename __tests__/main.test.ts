import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {restoreGlobalErrorHandlers} from 'jest-circus/build/globalErrorHandlers'

//
// test('wait 500 ms', async () => {
//   const start = new Date()
//   await wait(500)
//   const end = new Date()
//   var delta = Math.abs(end.getTime() - start.getTime())
//   expect(delta).toBeGreaterThan(450)
// })
//
// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = '500'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }
  console.log(cp.execSync(`node ${ip}`, options).toString())
})

test('dummytest', async () => {
  console.log('dummy')
})

test('test replace in files', () => {
  const from: string[] = []
  const to: string[] = []
  let toReplace: Map<string, string> = new Map<string, string>()
  toReplace.set('key1', 'val1')
  toReplace.set('key2', 'val2')
  toReplace.set('key3', 'val3')

  for (const [placeholder, value] of toReplace) {
    from.push(placeholder)
    to.push(value)
  }
  console.log(`toReplace: ${JSON.stringify(toReplace)}`)
  console.log(`TO: ${JSON.stringify(to)}`)
  console.log(`FROM: ${JSON.stringify(from)}`)
})

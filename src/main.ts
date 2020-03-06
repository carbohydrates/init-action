import * as core from '@actions/core'
import * as github from '@actions/github'
import * as glob from '@actions/glob'

async function run(): Promise<void> {
  try {
    // const token: string = core.getInput('token')
    const eventType: string = core.getInput('event_type')
    const payload = github.context.payload

    core.info(`Processing payload`)
    core.debug(`${toString(payload)}`)
    if (eventType !== payload.action) {
      core.info(
        `Expected event: ${eventType} \n Received Event: ${payload.action} \n Skipping event...`
      )
      return await Promise.resolve()
    }

    const clientPayload = payload.client_payload
    core.info(`Processing client payload: ${toString(clientPayload)}`)

    const filePatterns = clientPayload.filePatterns as string[]
    const globber = await glob.create(filePatterns.join('\n'), {
      followSymbolicLinks: false
    })

    const files = await globber.glob()
    core.info(files.toString())

    replace('foo', 'bar')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
function toString(obj: object): string {
  return JSON.stringify(obj)
}

function replace(pattern: string, value: string): void {
  core.info(`pattern ${pattern}, value: ${value}`)

  // core.info(files.toString())
}

import * as core from '@actions/core'
import * as github from '@actions/github'
import * as glob from '@actions/glob'

async function run(): Promise<void> {
  try {
    // const token: string = core.getInput('token')
    const eventType: string = core.getInput('event_type')
    const payload = github.context.payload

    interface Payload {
      filePatterns: string[]
      toReplace: ToReplace
    }

    interface ToReplace {
      PLACEHOLDER1: string
      PLACEHOLDER2: string
    }

    core.info(`Processing payload`)
    core.debug(`Payload is : ${JSON.stringify(payload)}`)
    if (eventType !== payload.action) {
      core.info(
        `Expected event: ${eventType} \n Received Event: ${payload.action} \n Skipping event...`
      )
      return
    }

    const clientPayload: Payload = payload.client_payload
    core.info(`Processing client payload: ${JSON.stringify(clientPayload)}`)
    // const toReplace = clientPayload.toReplace as Map<string, string>
    const filePatterns = clientPayload.filePatterns
    const globber = await glob.create(filePatterns.join('\n'), {
      followSymbolicLinks: false
    })

    const files = await globber.glob()
    core.info(files.toString())

    for (const file of files) {
      core.info(`Processing file:${file}`)
      // replace('foo', 'bar')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

// function replace(filePath: string, pattern: string, value: string): void {
//
//   core.info(`pattern ${pattern}, value: ${value}`)
//
//   // core.info(files.toString())
// }

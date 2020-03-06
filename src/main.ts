import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    // const token: string = core.getInput('token')
    const eventType: string = core.getInput('event_type')
    const payload = github.context.payload

    core.info(`Processing payload`)
    core.info(`${JSON.stringify(payload)}`)

    if (eventType !== payload.action) {
      core.info(
        `Expected event: ${eventType} \n Received Event: ${payload.action} \n Skipping event...`
      )
      return await Promise.resolve()
    }

    const clientPayload = payload.client_payload
    core.info(`${clientPayload}`)
    // const {data: pullRequest} = await octokit.pulls.get({
    //     owner: 'octokit',
    //     repo: 'rest.js',
    //     pull_number: 123,
    //     mediaType: {
    //         format: 'diff'
    //     }
    // });
    //
    // if (event_type !=)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

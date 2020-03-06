import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token')
    const eventType: string = core.getInput('event_type')
    core.info(`token=${token}`)
    core.info(`eventType=${eventType}`)
    const payload = github.context.payload

    if (eventType !== payload.action) {
      core.info(`Expected event: ${eventType}
             Received Event: ${payload.action}
             Skipping event...`)
      return await Promise.resolve()
    }

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
    const payJson = JSON.stringify(payload)

    core.info(`${payJson}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

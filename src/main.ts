import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token')
    const event_type: string = core.getInput('event_type')
    core.info(`${token}`)
    const payload = github.context.payload
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

    core.info(`${payload}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

import * as core from '@actions/core'
import * as github from '@actions/github'
import {wipeWorkflow} from './commons'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {ClientPayload, replace} from './replaceHelper'
import {pushChanges, createPullRequest} from './gitHelper'

async function run(): Promise<void> {
  try {
    const createPr: string = core.getInput('create_pr')
    const token: string = core.getInput('token')
    const eventType: string = core.getInput('event_type')
    const authorName: string = core.getInput('author_name')
    const authorEmail: string = core.getInput('author_email')
    const commitMessage: string = core.getInput('commit_message')
    const destroyWorkflow: string = core.getInput('destroy_after_execution')
    const payload: WebhookPayload = github.context.payload
    core.info(`Processing payload`)
    core.debug(`Payload is : ${JSON.stringify(payload)}`)
    if (eventType !== payload.action) {
      core.info(
        `Expected event: ${eventType} \n Received Event: ${payload.action} \n Skipping event...`
      )
      return
    }

    const clientPayload: ClientPayload = payload.client_payload
    core.info(`Processing client payload: ${JSON.stringify(clientPayload)}`)
    await replace(clientPayload)
    if (destroyWorkflow.toUpperCase() === 'TRUE') {
      await wipeWorkflow(github.context.workflow)
    }

    if (createPr.toUpperCase() === 'TRUE') {
      const prBranch = `init-action-changes-${process.env.GITHUB_RUN_ID}`
      await pushChanges(authorName, authorEmail, commitMessage, prBranch)
      const body = `This Pull request has been automatically created by init action, here you could find all changed that were made during repository initialization`
      await createPullRequest(
        token,
        'Init action Pull request',
        prBranch,
        'master',
        body,
        github.context.repo.repo,
        github.context.repo.owner
      )
    } else {
      await pushChanges(authorName, authorEmail, commitMessage, 'master')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

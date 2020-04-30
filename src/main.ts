import * as core from '@actions/core'
import * as github from '@actions/github'
import * as exec from '@actions/exec'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import replace, {ReplaceInFileConfig, ReplaceResult} from 'replace-in-file'
import {ExecOptions} from '@actions/exec/lib/interfaces'
import * as renamer from 'renamer'

async function run(): Promise<void> {
  try {
    const push: string = core.getInput('push_changes')
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

    interface ClientPayload {
      files: string[]
      ignores: string[]
      toReplace: {[key: string]: string}
    }

    const clientPayload: ClientPayload = payload.client_payload
    core.info(`Processing client payload: ${JSON.stringify(clientPayload)}`)
    const fromList: RegExp[] = Object.keys(clientPayload.toReplace).map(
      key => new RegExp(key, 'g')
    )
    core.info(`From:${fromList}`)
    const toList: string[] = Object.values(clientPayload.toReplace)
    core.info(`To:${toList}`)

    const options: ReplaceInFileConfig = {
      files: clientPayload.files,
      ignore: clientPayload.ignores,
      allowEmptyPaths: true,
      countMatches: true,
      from: fromList,
      to: toList
    }

    const results: ReplaceResult[] = await replace(options)
    core.info(`results: ${JSON.stringify(results)}`)

    if (destroyWorkflow.toUpperCase() === 'TRUE') {
      await wipeWorkflow(github.context.workflow)
    }

    if (createPr.toUpperCase() === 'TRUE') {
      prBranch = ''
    } else {
      prBranch = init - action - pr
    }

    await pushChanges(authorName, authorEmail, commitMessage, createPr)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

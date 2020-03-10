import * as core from '@actions/core'
import * as github from '@actions/github'
import * as exec from '@actions/exec'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import replace, {ReplaceInFileConfig, ReplaceResult} from 'replace-in-file'
import * as fs from 'fs'

async function run(): Promise<void> {
  try {
    const push: string = core.getInput('push_changes')
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
    core.info(
      `From:${Object.keys(clientPayload.toReplace).map(key => `/${key}/g`)}`
    )
    core.info(`To:${Object.values(clientPayload.toReplace)}`)
    const options: ReplaceInFileConfig = {
      files: clientPayload.files,
      ignore: clientPayload.ignores,
      allowEmptyPaths: true,
      countMatches: true,
      from: Object.keys(clientPayload.toReplace).map(key => `/${key}/g`),
      to: Object.values(clientPayload.toReplace)
    }

    const results: ReplaceResult[] = await replace(options)
    core.info(`results: ${JSON.stringify(results)}`)
    for (const resultInfo of results) {
      const filePath = resultInfo.file
      if (resultInfo.hasChanged) {
        fs.readFile(filePath, (err, data) => {
          if (err) throw err
          core.info(`info of :${filePath}`)
          core.info(`file is :\n${data}`)
        })
      }
    }

    if (push.toUpperCase() === 'TRUE') {
      await pushChanges(authorName, authorEmail, commitMessage)
    }

    if (destroyWorkflow.toUpperCase() === 'TRUE') {
      await wipeWorkflow(github.context.workflow)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

async function pushChanges(
  authorName: string,
  authorEmail: string,
  commitMessage: string
): Promise<void> {
  await core.group('push changes', async () => {
    await exec.exec('git', ['config', 'user.name', authorName])
    await exec.exec('git', ['config', 'user.email', authorEmail])
    await exec.exec('git', ['commit', '-am', commitMessage])
    await exec.exec('git', ['push'])
  })
}

async function wipeWorkflow(workflow: string): Promise<void> {
  core.info(`Deleting workflow`)
  await exec.exec('rm', [workflow])
}

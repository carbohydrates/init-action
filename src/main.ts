import * as core from '@actions/core'
import * as github from '@actions/github'
import * as exec from '@actions/exec'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import replace, {ReplaceInFileConfig, ReplaceResult} from 'replace-in-file'
import * as fs from 'fs'

async function run(): Promise<void> {
  try {
    // const token: string = core.getInput('token')
    const eventType: string = core.getInput('event_type')
    const authorName: string = core.getInput('author_name')
    const authorEmail: string = core.getInput('author_email')
    const commitMessage: string = core.getInput('commit_message')
    const payload: WebhookPayload = github.context.payload
    core.info(`Processing workload payload: ${github.context.workflow}`)

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

    const options: ReplaceInFileConfig = {
      files: clientPayload.files,
      ignore: clientPayload.ignores,
      allowEmptyPaths: true,
      countMatches: true,
      from: Object.keys(clientPayload.toReplace),
      to: Object.values(clientPayload.toReplace)
    }

    const results: ReplaceResult[] = await replace(options)
    core.info(`results: ${JSON.stringify(results)}`)
    for (const resultInfo of results) {
      const filePath = resultInfo.file
      fs.readFile(filePath, (err, data) => {
        if (err) throw err
        core.info(`info of :${filePath}`)
        core.info(`file is :\n${data}`)
      })
    }

    const push = false
    if (push) {
      await pushChanges(authorName, authorEmail, commitMessage)
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

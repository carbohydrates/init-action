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
    const payload: WebhookPayload = github.context.payload

    core.info(`Processing payload`)
    core.info(`Payload is : ${JSON.stringify(payload)}`)

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

    // const url = addToken(github.context.ref, token)
    // await pushChanges(
    //   'testbot',
    //   'test@example.com',
    //   'replace_compleete',
    //   'init-action',
    //   url
    // )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

// function toJson(map) {
//   return JSON.stringify(Array.from(map.entries()));
// }
//
// function fromJson(jsonStr) {
//   return new Map(JSON.parse(jsonStr));
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function pushChanges(
  authorName: string,
  authorEmail: string,
  commitMessage: string,
  branch: string,
  url: string
): Promise<void> {
  await core.group('push changes', async () => {
    await exec.exec('git', ['config', 'user.name', authorName])
    await exec.exec('git', ['config', 'user.email', authorEmail])
    await exec.exec('git', ['checkout', 'HEAD', '-b', branch])
    await exec.exec('git', ['commit', '-am', commitMessage])
    await exec.exec('git', ['remote', 'set-url', 'origin', url])
    await exec.exec('git', ['push', 'origin', 'HEAD'])
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addToken(url: string, token: string): string {
  return url.replace(/^https:\/\//, `https://x-access-token:${token}@`)
}

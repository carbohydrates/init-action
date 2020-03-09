import * as core from '@actions/core'
import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import replace, {ReplaceInFileConfig, ReplaceResult} from 'replace-in-file'
import * as fs from 'fs'

async function run(): Promise<void> {
  try {
    // const token: string = core.getInput('token')
    const eventType: string = core.getInput('event_type')
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
      toReplace: Map<string, string>
    }

    const clientPayload: ClientPayload = payload.client_payload
    core.info(`Processing client payload: ${JSON.stringify(clientPayload)}`)

    const toReplace = new Map(clientPayload.toReplace)
    core.info(`toreplace is ${toReplace}, ${JSON.stringify(toReplace)}`)
    const from: string[] = []
    const to: string[] = []

    for (const [placeholder, value] of toReplace) {
      from.push(placeholder)
      to.push(value)
    }

    const options: ReplaceInFileConfig = {
      files: clientPayload.files,
      ignore: clientPayload.ignores,
      allowEmptyPaths: true,
      countMatches: true,
      from,
      to
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
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

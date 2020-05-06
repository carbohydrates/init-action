import * as core from "@actions/core";
import replaceInFile, {ReplaceInFileConfig, ReplaceResult} from "replace-in-file";

export interface ClientPayload {
  files: string[]
  ignores: string[]
  toReplace: {[key: string]: string}
}


export async function replace(clientPayload: ClientPayload): Promise<void> {

  core.info(`Doing replace in files`)
  core.info(`Doing replace in filenames and folders`)

  const fromList: RegExp[] = Object.keys(clientPayload.toReplace).map(key => new RegExp(key, 'g'))
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
}

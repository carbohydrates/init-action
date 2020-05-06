import * as core from '@actions/core'
import * as exec from '@actions/exec'

export async function wipeWorkflow(workflowPath: string): Promise<void> {
  core.info(`Deleting ${workflowPath}`)
  await exec.exec('rm', [workflowPath])
}

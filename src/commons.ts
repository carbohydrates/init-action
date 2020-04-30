import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'

async function wipeWorkflow(workflowЗPath: string): Promise<void> {
  core.info(`Deleting workflow`)
  await exec.exec('rm', [workflowЗPath])
}

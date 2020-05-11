import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import {ExecOptions} from '@actions/exec/lib/interfaces'

export async function pushChanges(
  authorName: string,
  authorEmail: string,
  commitMessage: string,
  branch: string
): Promise<void> {
  await core.group('push changes', async () => {
    await exec.exec('git', ['diff'])
    await exec.exec('git', ['config', 'user.name', authorName])
    await exec.exec('git', ['config', 'user.email', authorEmail])
    await exec.exec('git', ['add', '--all'])
    await exec.exec('git', ['commit', '-am', commitMessage])

    let currentBranch = ''
    const options: ExecOptions = {}
    options.listeners = {
      stdout: (data: Buffer) => {
        currentBranch += data.toString()
      }
    }
    await exec.exec('git', ['branch', '--show-current'], options)

    if (branch === currentBranch) {
      core.info(
        `The current branch:${currentBranch} is the target branch:${branch}, push changes`
      )
      await exec.exec('git', ['push'])
    } else {
      core.info(
        `The current branch:${currentBranch} is the different then the target branch:${branch}, going to create it and push changes`
      )
      await exec.exec('git', ['checkout', '-b', branch])
      await exec.exec('git', ['push', '-u', 'origin', branch])
    }
  })
}

export async function createPullRequest(
  token: string,
  title: string,
  head: string,
  base: string,
  body: string,
  repo: string,
  owner: string
): Promise<void> {
  const octokit = new github.GitHub(token)
  await core.group('Creating pull request', async () => {
    octokit.pulls
      .create({
        title, // Commit title, generally should be less than 74 characters
        body, // Multi-line commit message
        owner, // Username or Organization with permissions to initialize Pull Request
        repo, // GitHub repository link or hash eg. `fancy-project`
        head, // Where changes are implemented, eg. `your-name:feature-branch`
        base, // Branch name where changes should be incorporated, eg. `master`
        draft: false // When `true`, no notifications are generated
      })
      .then(response => {
        core.info(
          `Pull request status is:${JSON.stringify(response.headers.status)}`
        )

        if (response['status'] !== 201) {
          core.info(`response is:${JSON.stringify(response)}`)
          const errorMessage = [
            'Response status was not 201 (created), please check',
            '- configurations for your Action',
            '- authentication for repository (write permissions)'
          ]

          throw new Error(errorMessage.join('\n'))
        }
      })
  })
}

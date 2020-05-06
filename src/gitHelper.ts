import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import {RequestOptions} from '@actions/github/lib/interfaces'
import {ExecOptions} from '@actions/exec/lib/interfaces'
import {GitHub} from "@actions/github";

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

export async function createPr(
  token: string,
  title: string,
  head: string,
  base: string,
  body: string
): Promise<string> {


  const githubClient: GitHub = new github.GitHub(token)
  const prOptions: Octokit.RequestOptions = {}
  const prParams: Octokit.PullsCreateParams = {}

  githubClient.pulls.create(prParams,)
  octokit.pulls.create()

  const {data: pullRequest} = await octokit.pulls.get({
    owner: 'octokit',
    repo: 'rest.js',
    pull_number: 123,
    mediaType: {
      format: 'diff'
    }
  });

  console.log(pullRequest);

  return `ss`
}
import * as core from '@actions/core'
import * as exec from '@actions/exec'
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
//
// export async function createPr(
//
//   tergetBranch: string,
//   destina: string,
//   commitMessage: string,
//   branch: string
// ) {
//
//   title	string	Required. The title of the new pull request.
//     head	string	Required. The name of the branch where your changes are implemented. For cross-repository pull requests in the same network, namespace head with a user like this: username:branch.
//     base	string	Required. The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repository that requests a merge to a base of another repository.
//     body	string	The contents of the pull request.
//     maintainer_can_modify	boolean	Indicates whether maintainers can modify the pull request.
//     draft
// }
//
// const octokit = new github.GitHub("sss")
// const proptions: Octokit.RequestOptions = {}
// const prParams: Octokit.PullsCreateParams = {}
// octokit.pulls.create()
//
// const {data: pullRequest} = await octokit.pulls.get({
//   owner: 'octokit',
//   repo: 'rest.js',
//   pull_number: 123,
//   mediaType: {
//     format: 'diff'
//   }
// });
//
// console.log(pullRequest);

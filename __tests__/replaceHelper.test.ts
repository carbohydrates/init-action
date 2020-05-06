import * as process from "process";
import * as path from "path";
import * as cp from "child_process";
import * as glob from '@actions/glob'
import * as core from "@actions/core";
import {Globber, GlobOptions} from "@actions/glob";


test('test glob', async () => {

  const globOptions: GlobOptions = {
    followSymbolicLinks:false
  }
  const patterns = ['**/__pattern__/**']
  const globber:Globber = await glob.create(patterns.join('\n'), globOptions)
  for await (const file of globber.globGenerator()) {
    console.log(`find file: ${file}`)
  }
  // const path = globber.getSearchPaths()
  // console.log(`pathes: ${path}`)

})



// "files": ["**"],
//   "ignores": ["**/.github/*", "**/scripts/*"],
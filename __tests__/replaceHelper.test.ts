import * as process from 'process'
import * as path from 'path'
import * as cp from 'child_process'
import * as globby from 'globby'
import * as core from '@actions/core'
import {Globber, GlobOptions} from '@actions/glob'

test('test glob', async () => {
  console.log('dummy')
  // const globOptions: GlobOptions = {
  //   followSymbolicLinks:false
  // }
  // const patterns = ['**/.*__pattern__.*/**']
  // const globber:Globber = await glob.create(patterns.join('\n'), globOptions)
  // const path = globber.getSearchPaths()
  // console.log(`pathes: ${path}`)
  //
  //
  // for await (const file of globber.globGenerator()) {
  //   console.log(`find file: ${file}`)
  // }

  //
  //   const fs = require('fs');
  //   const path = require('path');
  //
  // fs.
  //   const dirContent = fs.readdirSync('.')
  //
  // dirContent.forEach((file))

  //   function findInDir (dir, filter, fileList = []) {
  //     const files = fs.readdirSync(dir);
  //
  //     files.forEach((file) => {
  //       const filePath = path.join(dir, file);
  //       const fileStat = fs.lstatSync(filePath);
  //
  //       if (fileStat.isDirectory()) {
  //         findInDir(filePath, filter, fileList);
  //       } else if (filter.test(filePath)) {
  //         fileList.push(filePath);
  //       }
  //     });
  //
  //     return fileList;
  //   }
  //
  // // Usage
  //   findInDir('./public/audio/', /\.mp3$/);

  // "files": ["**"],
  //   "ignores": ["**/.github/*", "**/scripts/*"],
})

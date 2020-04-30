
import {pushChanges} from "../src/gitHelper"


test('test push changes', () => {
  pushChanges(  "testauthor", "example@mail.com", "testcommitmessage", "testbranch")
})

test('dummytest', async () => {
  console.log('dummy')
})

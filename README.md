# Init-action

This action is used for one time automation after repository creation.
This will utilize dispatcher webhook for handling custom event payload.

## Usage

See [action.yml](action.yml), [init-workflow](.github/workflows/init-workflow.yaml)

```yaml
on: repository_dispatch
jobs:
  init: # make sure the action works on a clean machine without building
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: carbohydrates/init-action@v3
        with:
          destroy_after_execution: 'false'
```

## Triggering the action
This action is triggered by custom API call https://help.github.com/en/actions/reference/events-that-trigger-workflows#external-events-repository_dispatch.

__Note: This event will only trigger a workflow run if the workflow file is on the master or default branch.__

```yaml
{
    "event_type": "init_action", 
    "client_payload": {
        "files": ["**/*.yaml"],
        "ignores": [],
        "toReplace": {
            "__PLACEHOLDER1__": "someValue1",
            "__PLACEHOLDER2__": "someValue2",
            "_placeholder1__" : "yaaaay"
        }
    }
}
```

| Name                     | Type                    | description                                                                                      |
|--------------------------|-------------------------|--------------------------------------------------------------------------------------------------|
| event_type               | `string`                  | Required: A custom webhook event name.                                                           |
| client_payload           | `object`                  | JSON payload with extra information about the webhook event that your action or worklow may use. |
| client_payload.files     | `string[]`                | Array of the file patterns that should be used for processing                                    |
| client_payload.ignores   | `string[]`                | Array of the file patterns that should be excluded from processing                               |
| client_payload.toReplace | `{[key: string]: string}` | Map of k,v where k replacing placeholder and v is value for this replacement  


```bash
curl --request POST \
  --url https://api.github.com/repos/carbohydrates/init-action/dispatches \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/json' \
  --data '{"event_type":"init_action","client_payload":{"files":["**/*.yaml"],"ignores":[],"toReplace":{"__PLACEHOLDER1__":"someValue1","__PLACEHOLDER2__":"someValue2","_placeholder1__":"yaaaay"}}}'
```

*NOTE:* For private repos you should use Basic Auth with private access token

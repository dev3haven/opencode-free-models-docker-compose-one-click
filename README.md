### How to

1. Run `docker compose -f ./blabla/compose.yml up`. It will create `data/` dir near the `compose.yml` file with config files
2. copy `providers` (an **opencode2api** block) section from `data/opencode.jsonc` to `c:\Users\user\.config\opencode\opencode.json`
3. copy `opencode2api.key` file to `c:\Users\user\.config\opencode\` dir
4. In **opencode** choose an **opencode2api** model

### Clean all files and configurations, e.g. for a new installation

1. `docker compose run --rm opencode2api-reset`

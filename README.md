### What is it
The project can **bypass some limits** of free [OpenCode](https://opencode.ai/) LLM models. It's a wrapper around a [jasonxu114514/opencode2api](https://github.com/jasonxu114514/opencode2api) project. The main goal of the project is an **easy configuration**.

### `opencode2api-compose.yaml`

1. Run `docker compose -f ./blabla/compose.yml up`. It will create `data/` dir near the `compose.yml` file with config files.
2. Copy `providers` (an **opencode2api** block) section from `data/opencode.jsonc` to `c:\Users\user\.config\opencode\opencode.json`.
3. Copy `opencode2api.key` file to `c:\Users\user\.config\opencode\` dir.
4. In **opencode** choose an **opencode2api** model.

### `qwen2api-qwenproxy-compose.yaml`

1. Go to https://chat.qwen.ai and sign up.
2. Paste these login-password pairs to `qwen2api-qwenproxy-compose.yaml`.
3. Run `docker compose up`, copy a provider from `data/opencode.jsonc to `c:\Users\user\.config\opencode\opencode.json`.

### `requesty2api-naga2api-compose.yaml`

1. Go to https://app.requesty.ai and sign up/in.
2. Create an api key and paste it to the `requesty2api-naga2api-compose.yaml`.
3. Do the same with https://naga.ac
4. Run `docker compose up`, copy a provider from `data/opencode.jsonc to `c:\Users\user\.config\opencode\opencode.json`.

### Clean up

- Run `docker compose run --rm xxxxxxx-reset` from a `compose.yaml`.

### A bonus part

**IF A MODEL WAS BLOCKED FOR YOUR LOCATION BY IP** you can run OpenCode through a proxy

```bat
@echo off
setlocal

set "HTTP_PROXY=http://localhost:31184"
set "HTTPS_PROXY=http://localhost:31184"
set "NO_PROXY=localhost,127.0.0.1,::1,0.0.0.0,*.localhost,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,169.254.0.0/16,fe80::/10,fc00::/7,.local,*.local,*.docker.internal,%COMPUTERNAME%"

start "" "%LOCALAPPDATA%\Programs\OpenCode\OpenCode.exe"

endlocal
exit /b 0
```

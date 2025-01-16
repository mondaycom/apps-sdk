# apps-sdk

This sdk is used to leverage some of the capabilities exposed via `<monday-code />`:

<!-- TOC -->

- [Storage](#storage)
- [Secure storage](#secure-storage)
- [Environment variables manager](#environment-variables-manager)
- [Logger](#logger)
<!-- TOC -->

## Storage

<h4 style="color:red"><b>* Please note Storage contracts have been updated at version v1.0.0 *</b></h4>

<details>
<summary>key/value storage for monday-code projects</summary>

- This is the way to store customer data for your app
- **_key/value_** based where the **_key_** is a `string` and **_value_** can be `any serializable type` (object, number, string, etc.)
- **_Compartmentalized_** based on **accountId** and **app** for your specific app which means that data stored for one account will not be accessible from the context of another account
- There are two modes for the storage which are based on a passed option `shared`:
  - `false` _(default)_ - The stored data will be accessible **only** you "backend" oriented apps (storage will not be shared between integrations and views).
  - `true` - The stored data will be accessible from **both** "backend" and "frontend" oriented apps.

### Storage API

There are four methods exposed to manage the storage - `set`, `get`, `search` and `delete`

#### Initialize

- `<ACCESS_TOKEN>` - access token of the customer/account the app is working on behalf of

```typescript
import { Storage } from '@mondaycom/apps-sdk';

const storage = new Storage('<ACCESS_TOKEN>');
```

#### Set

- `key: string` - key to store the content for
- `value: any` - value to store
- `previousVersion?: string` - the last version of the stored value for a specific key (_OPTIONAL_)
- `shared?: boolean` - whether the stored data will be accessible from both "backend" and "frontend" oriented apps (_OPTIONAL_)
- `version: string` - the new version of the stored value

```typescript
const { version, success, error } = await storage.set(key, value, { previousVersion, shared });
```

#### get

```typescript
const { value, version, success } = await storage.get(key, { shared });
```

#### search

- `key: string` - key aka 'key part' the key must include this string (case insensitive)
- `cursor: string` - current position within the paginated dataset (_OPTIONAL_)

```typescript
const { records, cursor, success } = await storage.search(key, { cursor });
```

#### delete

```typescript
const { success, error } = await storage.delete(key, { shared });
```

</details>

## Secure storage

<details>
<summary>key/value secure storage for monday-code projects</summary>

- This is the way to store sensitive customer data (i.e access tokens generated by OAuth for example)
- Has 3 different modes (dependent on where it is used)
  - `Secure storage` - when used in a deployed `<monday-code/>` project it will automatically utilize the **real** secure storage
  - `Local "secure storage"` - a local mock db which will mimic the api exposed by the real secure storage. Will work in this mode when sdk is used locally.
    > If there are no permissions to write files on the disk, Local "secure storage" will not be persisted
- **_key/value_** based where the **_key_** is a `string` and **_value_** can be `any type` (object, number, string, etc.)
- **_compartmentalized_** for your **specific app** which means that data stored for one app will not be accessible by other apps

### Secure Storage API

There are three methods exposed to manage the storage - `set`, `get` and `delete`

#### initialize

```typescript
import { SecureStorage } from '@mondaycom/apps-sdk';

const secureStorage = new SecureStorage();
```

#### Set

- `key: string` - key to store the content for
- `value: any` - value to store (must be serializable)

```typescript
await secureStorage.set(key, value);
```

#### get

```typescript
const storedValue = await secureStorage.get(key);
```

#### delete

```typescript
await secureStorage.delete(key);
```

</details>

## Environment variables manager

<details>
<summary>Read environment variables in monday-code projects</summary>

- This is the way to **read** environment variables for your app in a project deployed `<monday-code/>`.
- Environment variables set via [@mondaycom/apps-cli](https://www.npmjs.com/package/@mondaycom/apps-cli)
  ```shell
  $ mapps code:env -m set -k <key> -v <value>
  ```
- The environment variables are on the **app** level which means that they are accessible by all the **versions** of the app

### Environment variables manager API

There are two methods exposed to manage the environment variables - `get` and `getKeys`

#### initialize

```typescript
import { EnvironmentVariablesManager } from '@mondaycom/apps-sdk';

// Initialize the environment variables manager without injecting env into `process.env`
let envManager = new EnvironmentVariablesManager();

// Initialize the environment variables manager and inject env into `process.env`
envManager = new EnvironmentVariablesManager({ updateProcessEnv: true });
```

#### get

```typescript
// Get cached environment variable
const cachedValue = envManager.get(key, { invalidate: false });

// Get the latest version of environment variable
const latestValue = envManager.get(key);
```

#### getKeys

```typescript
// Get all cached environment variables keys
const cachedKeys = envManager.getKeys({ invalidate: false });

// Get all environment variables keys
const latestKeys = envManager.getKeys();
```

</details>

## Secrets manager

<details>
<summary>Read secrets in monday-code projects</summary>

- This is the way to **read** secrets for your app in a project deployed `<monday-code/>`.
- Secrets are set via the Secrets tab in the Dev Center UI in the monday code section

### Secrets manager API

There are two methods exposed to manage the secrets - `get` and `getKeys`

#### initialize

```typescript
import { SecretsManager } from '@mondaycom/apps-sdk';

const secretsManager = new SecretsManager();
```

#### get

```typescript
// Get cached secrets
const cachedValue = secretsManager.get(key, { invalidate: false });

// Get the latest version of a secret
const latestValue = secretsManager.get(key);
```

#### getKeys

```typescript
// Get all cached secrets keys
const cachedKeys = secretsManager.getKeys({ invalidate: false });

// Get all secrets keys
const latestKeys = secretsManager.getKeys();
```

</details>

## Logger

<details>

<summary>Recommended logger for monday-code projects</summary>

- This `logger` provides a simple way to log messages for your app in a project deployed `<monday-code/>`.
- Logged messages are accessible via via [@mondaycom/apps-cli](https://www.npmjs.com/package/@mondaycom/apps-cli)
  ```shell
  $ mapps code:logs
  ```
- Logs written **without** this logger may not be accessible via [@mondaycom/apps-cli](https://www.npmjs.com/package/@mondaycom/apps-cli) or not get labeled correctly

### Logger API

There are four methods exposed to manage the environment variables - `info`, `warn`, `error` and `debug`.

#### initialize

```typescript
import { Logger } from '@mondaycom/apps-sdk';

const tag = 'my-app';
// tag will be added to every logged message
const logger = new Logger(tag);
```

#### info

```typescript
logger.info('info message');
```

#### warn

```typescript
logger.warn('warn message');
```

#### debug

```typescript
logger.debug('debug message');
```

#### error

```typescript
// Stack trace will be logged as well if error is provided
logger.error('error message', { error: new Error('error') });
```

</details>

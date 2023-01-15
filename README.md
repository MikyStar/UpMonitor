# Up Monitor

Run CRON jobs to notify on Discord if an HTTP endoint is down

## Setup

1. Clone the project

```sh
git clone https://github.com/MikyStar/UpMonitor.git
```

2. Create a configuration file

```sh
cp config/config.example.ts config/config.ts
```

Edit it according to the [config file section](#config-file)

3. Install dependencies

```sh
pnpm i
```

4. Run server

```sh
pnpm start
# OR run with pm2, check npm scripts for more
pnpm daemon:start # Auto rerurn + scheduled process exit for memory release
```

## Config file

> You should make your own configuration file at _config/config.ts_ based on _config/config.example.ts_

```ts
import { IConfig } from './IConfig'; // Provides IntelliSense

export const Config: IConfig = {
  discordToken: 'Token',
  errorsChannelID: 'Global Discord errors channel ID',
  logsChannelID: 'Global Discord logs channel ID',

  endpointsConfigs: [
    {
      name: 'Endpoint name',
      url: 'http://url.com',
      expectedStatusCode: 200,
      channelID: 'Discord Channel ID',
      cronJobSchedule: '15 14 1 * *', // At 14:15 on day-of-month 1
    },
  ],
};

```

## Discord

### Add bot to channel

1. Go to [Discord developper console](https://discord.com/developers)
2. Create an application
3. Generate connexion token
  - Go to Bot section
  - Reset secret
  - Copy
4. Invite to channel
  - Go to OAuth section
  - Go to URL Generator
  - Scope > Bot > Send Messages
  - Copy URL
  - Open URL and follow the invite process
  - Go to the channel's settings in Discord App
  - Add member and toggle it's permissions so that it can send messages

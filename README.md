# Up Monitor

Run CRON jobs to notify on Discord if an HTTP endoint is down

## Setup

> You should make your own configuration file at _config/config.ts_ based on _config/config.example.ts_

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
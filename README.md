# Transfer hermes_hub prod version to rpi

`rsync -r -f '- file-to-exclude' ./localdir user@ip_address:/path/to/destination`
must do npm build && npm prune --production
must transfer package.json, package-lock.json dist/ node_modules/
run as npm run start:prod

`source:` [correctly build nodejs apps](https://splunktool.com/how-to-correctly-build-nestjs-app-for-production-with-nodemodules-dependencies-in-bundle)

# Rpi ssh-key

`source`: [configure ssh-key on rpi](https://www.geekyhacker.com/2021/02/15/configure-ssh-key-based-authentication-on-raspberry-pi/)

1. create ssh key to connect to rpi (`ssh-keygen` and tap yes to all)
2. register key on rpi (`ssh-copy-id <user>@<ip-address>`)
3. connect directly to rpi or send files (`ssh <user>@<ip-address>` or `rsync -r <origin> <user>@<ip-address>:<destination>`)

# Verdaccio and simple local storage

This example shows a simple configuration for `verdaccio` plus the default local storage with the minimum configuration required using `docker-compose`.

Contains

- conf: Configuration file and default user httpasswd
- storage: A published default package with 2 versions.

```bash
$> docker-compose up
```

## Login

If you want to login into the Verdaccio instance created via these Docker Examples, please try:

Username: jpicado
Password: jpicado

## Running in Dokku

If you use Dokku, an open-source alternative for Heroku, you can run this example using the following steps:

1. Create a new application `dokku apps:create verdaccio`
2. Pull the verdaccio image `docker pull verdaccio/verdaccio:`
3. Tag the docker image for the app: `docker tag verdaccio/verdaccio:nightly-master dokku/verdaccio:v1`
4. Create the directories for persistent storage `mkdir -p /var/lib/dokku/data/storage/verdaccio/storage`, `mkdir -p /var/lib/dokku/data/storage/verdaccio/storage`
5. Mount the volumes: `dokku storage:mount verdaccio /var/lib/dokku/data/storage/verdaccio/storage:/verdaccio/storage` and `dokku storage:mount verdaccio /var/lib/dokku/data/storage/verdaccio/conf:/verdaccio/conf`
6. Deploy the docker image `dokku tags:deploy verdaccio v1`
7. Enjoy the application

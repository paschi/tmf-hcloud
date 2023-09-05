<div align="center">

  # tmf-hcloud

  [![Pulumi][badge-pulumi]][uri-pulumi]
  [![Hetzner][badge-hetzner]][uri-hetzner]

  ***Trackmania Forever** server running on **Hetzner Cloud** powered by **Pulumi**.*
  
  *Uses the awesome **Docker** image from [fanyx/docker-tmserver][uri-fanyx-docker-tmserver].*

</div>

## ⚡️ Getting Started

First, install [Pulumi][uri-pulumi-install] and [Node.js][uri-nodejs-install], if you have not already.

To be able to create resources in the Hetzner Cloud, you need to create an API token in your account and register it as an environment variable:
```shell
$ export HCLOUD_TOKEN=<YOUR_HCLOUD_ACCESS_TOKEN>
```

After that, login to your Pulumi account and create an active stack:
```shell
$ pulumi login
$ pulumi stack init <YOUR_PULUMI_STACK>
$ pulumi stack select <YOUR_PULUMI_STACK>
```

Once that is done, you can deploy the stack:
```shell
$ pulumi up
```

This will create all required resources and start the docker containers. The IP address of the server can be found in the outputs section of the `pulumi up` command.

After you're done playing, you can tear down the stack:
```shell
$ pulumi destroy
```

## ⚙️ Configuration

The server and game settings can be configured using the Pulumi CLI:
```shell
# Location and type of cloud server to use.
# See Hetzner documentation for available options.
pulumi config set --path "server.location" "fsn1"
pulumi config set --path "server.type" "cx21"

# Database settings.
pulumi config set --path "database.rootPassword" "<DB_ROOT_PASSWORD>" --secret
pulumi config set --path "database.database" "<DB_DATABASE_NAME>"
pulumi config set --path "database.username" "<DB_USER_NAME>"
pulumi config set --path "database.password" "<DB_PASSWORD>" --secret

# TrackMania game settings.
pulumi config set --path "game.name" "<GAME_NAME>"
pulumi config set --path "game.description" "<GAME_DESCRIPTION>"
pulumi config set --path "game.password" "<GAME_PASSWORD>" --secret
pulumi config set --path "game.maxPlayers" "<MAX_PLAYER_COUNT>"
pulumi config set --path "game.loginUser" "<SERVER_LOGIN_USER_NAME>"
pulumi config set --path "game.loginPassword" "<SERVER_LOGIN_PASSWORD>" --secret
pulumi config set --path "game.adminPassword" "<ADMIN_PASSWORD>" --secret
pulumi config set --path "game.superAdminPassword" "<SUPER_ADMIN_PASSWORD>" --secret
pulumi config set --path "game.masterAdmin" "<MASTER_ADMIN_ACCOUNT_NAME>"
```

Using `--secret` ensures that those values are getting encrypted in your stack configuration.

Please note that currently not all configuration options of the Docker image have been implemented in this repository.

[badge-hetzner]: https://img.shields.io/badge/Hetzner-D50C2D.svg?style=for-the-badge&logo=Hetzner&logoColor=white
[badge-pulumi]: https://img.shields.io/badge/Pulumi-8A3391.svg?style=for-the-badge&logo=Pulumi&logoColor=white
[uri-fanyx-docker-tmserver]: https://github.com/fanyx/docker-tmserver
[uri-hetzner]: https://www.hetzner.com
[uri-nodejs-install]: https://nodejs.org/en/download
[uri-pulumi]: https://www.pulumi.com
[uri-pulumi-install]: https://www.pulumi.com/docs/install

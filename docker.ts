import * as command from "@pulumi/command";
import * as pulumi from "@pulumi/pulumi";
import * as config from "./config";
import * as game from "./game";
import * as ssh from "./ssh";
import { resource } from "./utils";

const dockerCreateNetworkCommand = new command.remote.Command(resource("docker-create-network-command"), {
    connection: ssh.connection,
    create: pulumi.interpolate`docker network create trackmania-net`,
    delete: pulumi.interpolate`docker network rm trackmania-net`,
    triggers: [ssh.connection.host],
});

createDockerResources(config.dockerDatabase, dockerCreateNetworkCommand);
createDockerResources(config.dockerGame, dockerCreateNetworkCommand, [game.writePluginBlacklistFile, game.writeTrackPlaylistFile]);

function createDockerResources(container: config.DockerConfig, networkResource: command.remote.Command, dependsOn?: pulumi.Resource[]) {
    const dockerPullCommand = new command.remote.Command(resource(`docker-pull-${container.name}-command`), {
        connection: ssh.connection,
        create: pulumi.interpolate`docker image pull -q ${container.image}`,
        delete: pulumi.interpolate`docker image rm -f ${container.image}`,
        triggers: [ssh.connection.host],
    });
    const ports = pulumi.interpolate`${container.ports
        .map(p => `-p ${p.port}:${p.port}/${p.protocol}`)
        .join(" ")}`;
    const volumes = pulumi.interpolate`${container.volumes
        .map(v => `-v ${v.hostPath}:${v.containerPath}`)
        .join(" ")}`;
    const envs = pulumi.interpolate`${Object.entries(container.envs)
        .filter(([,v]) => v !== undefined)
        .map(([k, v]) => `-e ${k}="${v}"`)
        .join(" ")}`;
    new command.remote.Command(resource(`docker-run-${container.name}-command`), {
        connection: ssh.connection,
        create: pulumi.interpolate`docker run -q -d --rm --name ${container.name} --net ${networkResource.stdout} ${ports} ${volumes} ${envs} ${dockerPullCommand.stdout}`,
        delete: pulumi.interpolate`docker stop $(docker ps -q --filter ancestor=${dockerPullCommand.stdout})`,
        triggers: [ssh.connection.host],
    }, {
        dependsOn: dependsOn,
    });
}

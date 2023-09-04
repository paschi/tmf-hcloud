import * as command from "@pulumi/command";
import * as keys from "./keys";
import { server } from "./server";

export const connection: command.types.input.remote.ConnectionArgs = {
    host: server.ipv4Address,
    user: "root",
    privateKey: keys.privateKey.privateKeyOpenssh,
    dialErrorLimit: 20,
};

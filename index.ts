import * as config from "./config";
import "./docker";
import { server } from "./server";

export const ip = server.ipv4Address;
export const password = config.game.password;
export const serverUser = config.game.loginUser;
export const serverName = config.game.name;

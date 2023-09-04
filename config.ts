import * as pulumi from "@pulumi/pulumi";
import { Port, Volume } from "./utils";

const config = new pulumi.Config();

export interface ServerConfig {
    type: string,
    location: string,
}

export interface DockerConfig {
    image: string,
    name: string,
    ports: Port[],
    volumes: Volume[],
    envs: Record<string, string>,
}

export interface DatabaseConfig {
    rootPassword: string,
    database: string,
    username: string,
    password: string,
}

export interface GameConfig {
    loginUser: string,
    loginPassword: string,
    masterAdmin: string,
    name?: string,
    description?: string,
    password?: string,
    adminPassword?: string,
    superAdminPassword?: string,
    maxPlayers?: number,
    pluginBlacklist?: string[],
}

export const server = config.requireObject<ServerConfig>("server");
export const database = config.requireObject<DatabaseConfig>("database");
export const game = config.requireObject<GameConfig>("game");

export const dockerDatabase = {
    image: "mysql:5",
    name: "db",
    ports: [],
    volumes: [],
    envs: {
        "MYSQL_ROOT_PASSWORD": database.rootPassword,
        "MYSQL_DATABASE": database.database,
        "MYSQL_USER": database.username,
        "MYSQL_PASSWORD": database.password,
    },
} as DockerConfig;

export const dockerGame = {
    image: "fanyx/tmserver:2.1.1",
    name: "trackmania",
    ports: [
        {
            port: 2350,
            protocol: "tcp",
        },
        {
            port: 2350,
            protocol: "udp",
        },
        {
            port: 3450,
            protocol: "udp",
        },
    ],
    volumes: [
        {
            hostPath: "./playlist.txt",
            containerPath: "/var/lib/tmserver/playlist.txt" ,
        },
        {
            hostPath: "./blacklist.txt",
            containerPath: "/var/lib/xaseco/blacklist" ,
        },
    ],
    envs: {
        "SERVER_LOGIN": game.loginUser,
        "SERVER_LOGIN_PASSWORD": game.loginPassword,
        "SERVER_NAME": game.name,
        "SERVER_COMMENT": game.description,
        "SERVER_PASSWORD": game.password,
        "SERVER_SA_PASSWORD": game.superAdminPassword,
        "SERVER_ADM_PASSWORD": game.adminPassword,
        "MAX_PLAYERS": game.maxPlayers?.toString(),
        "CUSTOM_PLAYLIST": "true",
        "TIMEATTACK_LIMIT": "300000",
        "MASTERADMIN_LOGIN": game.masterAdmin,
        "MYSQL_HOST": dockerDatabase.name,
        "MYSQL_LOGIN": database.username,
        "MYSQL_PASSWORD": database.password,
        "MYSQL_DATABASE": database.database,
    },
} as DockerConfig;

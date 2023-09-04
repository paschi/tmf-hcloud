import * as pulumi from "@pulumi/pulumi";

export interface Port {
    port: number,
    protocol: string
}

export interface Volume {
    hostPath: string,
    containerPath: string
}

export function resource(name: string) {
    return pulumi.getProject() + "-" + pulumi.getStack() + "-" + name;
}

export function shuffle(arr: string[]) {
    let j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}

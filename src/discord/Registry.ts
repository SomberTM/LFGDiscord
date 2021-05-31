import Discord from "discord.js";
import path from "path";
import fs from "fs";

import { callerDirectory, JsonObject, merge } from "../utils/Utils";

export namespace Registry {

    const commands: Discord.Collection<String, Information> = new Discord.Collection<String, Information>();
    const groups: Discord.Collection<String, Information[]> = new Discord.Collection<String, Information[]>();
    let workingDirectory: string;

    export function focus(directory: string) { 
        workingDirectory = path.join(callerDirectory(2), directory); 
        return Registry; 
    }

    export function load(): { commands: Discord.Collection<String, Information>, groups: Discord.Collection<String, Information[]> } {
        for (const file of fs.readdirSync(workingDirectory))  {
            let dest = path.join(workingDirectory, file);
            if (fs.statSync(dest).isFile())
                require(dest)
        }
        
        return { commands, groups };
    }

    export function get(id: string): Information | undefined {
        return commands.get(id);
    }

    export function runner<I extends Information<unknown>>(id: string): I["run"] | undefined {
        return get(id)?.run;
    }

    export function getCommands(): Discord.Collection<String, Information> {
        return commands;
    }

    export function getGroups(): Discord.Collection<String, Information[]> {
        return groups;
    }

    export function Command<I extends Information<unknown>>(information: I): I["run"] {
        let copy: Partial<Information> = { ...information };
        delete copy.run;
        information.run = information.run.bind(copy);

        commands.set(information.name, <Information> merge(EmptyOptionalInformation, <JsonObject<any>> information));
        if (information.group) {
            if (!groups.has(information.group)) groups.set(information.group, [ information ]);
            else groups.get(information.group)?.push(information);
        }
        return information.run;
    }

    export interface MessageData {
        client: Discord.Client;
        message: Discord.Message;
        information: Information;
        command: string;
        args: string[];
    }

    export type CommandRunner<R> = (data: MessageData) => R;
    export type OptionalArgsCommandRunner<R> = (data?: MessageData) => R;
    export interface Information<R = void> {
        name: string,
        displayName?: string,
        aliases?: string[],
        description?: string,
        group?: string,
        ownerOnly?: boolean,
        guildOnly?: boolean,
        dmOnly?: boolean,
        clientPermissions?: Discord.PermissionResolvable[],
        userPermissions?: Discord.PermissionResolvable[]
        run: CommandRunner<R> | OptionalArgsCommandRunner<R>,
    }

    export const EmptyOptionalInformation: Required<Omit<Information, "name" | "run">> = {
        displayName: "",
        aliases: [],
        description: "",
        group: "",
        ownerOnly: false,
        guildOnly: false,
        dmOnly: false,
        clientPermissions: [],
        userPermissions: [],
    }

    export enum Groups {
        Utility = "Utility",
        Functional = "Functional",
        Fun = "Fun",
        Games = "Games"
    }

}
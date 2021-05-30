import Discord from "discord.js";
import path from "path";
import fs from "fs";

import { callerDirectory } from "../utils/Utils";

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

    export function Command<I extends Information<unknown>>(information: I): I["run"] {
        let copy: Partial<Information> = { ...information };
        delete copy.run;
        information.run = information.run.bind(copy);

        commands.set(information.id, information);
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
        id: string;
        name?: string;
        description?: string;
        group?: string;
        ownerOnly?: boolean,
        guildOnly?: boolean,
        dmOnly?: boolean,
        run: CommandRunner<R> | OptionalArgsCommandRunner<R>;
    }

    export enum Groups {
        Utility = "Utility",
        Functional = "Functional",
        Fun = "Fun",
        Games = "Games"
    }

    // export type RequiredInformation = PartialExcept<Information, "id" | "run">;
    // export class Registry {

    //     #commands: Collection<string, Information>;
    //     #dir: string;
    //     #files: string[];

    //     public constructor(dir: string) {
    //         this.#commands = new Collection();
    //         this.#files = [];
    //         this.#dir = path.join(callerDir(), dir);
    //     }

    //     get commands() { return this.#commands; }

    //     public requireAll() {
    //         for (let file of fs.readdirSync(this.#dir)) {
    //             let fLoc: string = path.join(this.#dir, file);
    //             this.#files.push(fLoc);
    //             require(fLoc);
    //         }
    //     }

    //     public get<R>(key: string): Information<R> | undefined {
    //         return <Information<R> | undefined> this.#commands.get(key);
    //     }

    //     public register(info: Information): Information {
    //         let copy: Partial<Information> = { ...info };
    //         delete copy.run;
    //         info.run = info.run.bind(<Required<Information>> copy);
    //         this.#commands.set(info.id, info);
    //         return info;
    //     }

    // }

}
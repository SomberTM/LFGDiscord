require("dotenv").config();
import Discord from "discord.js";
import { CommandHandler } from "./CommandHandler";

export type ClientOptions = {
    prefix?: string
} & Discord.ClientOptions

export class Client extends Discord.Client {

    #handler: CommandHandler;
    declare options: ClientOptions;

    public constructor(options?: ClientOptions) {
       super(options);
       this.#handler = new CommandHandler(this.options?.prefix || '!');
       console.log(this.#handler);
    }

}
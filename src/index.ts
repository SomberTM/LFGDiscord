require("dotenv").config();
import { Client } from "./discord/Client";
import { Registry } from "./discord/Registry";
import { onMessage } from "./discord/events/Message";

(async function() {
    Registry.focus("./discord/commands").load();

    const client = new Client({ 
        prefix: process.env.PREFIX 
    });

    client.on('message', onMessage);
    client.login(process.env.TOKEN);
})();
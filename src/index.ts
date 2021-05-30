require("dotenv").config();
import { Registry } from "./discord/CommandHandler";

(async function() {
    Registry.focus("./discord/commands").load();
    console.log(process.env.TOKEN);
})();
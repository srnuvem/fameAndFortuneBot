import { QuickDB } from "quick.db";
import { client } from "../..";
import { Event } from "../../structs/types/Event";
const db = new QuickDB();

export default new Event({
    name: "ready",
    once: true,
    async run() {

        const { commands, buttons, selects, modals } = client;

        console.log("✅ Bot online".green);
        console.log(`Commands loaded: ${commands.size}`.cyan);
        console.log(`Buttons loaded: ${buttons.size}`.cyan);
        console.log(`Select Menus loaded: ${selects.size}`.cyan);
        console.log(`Modals loaded: ${modals.size}`.cyan);
        await db.set("running", "Yes");
        db.get("running").then(value => console.log(`QuickDB running: ${value}`.cyan))

        // run forever
        // get all fichas in db
        // for each ficha, create a channel if don't exist
        // for each ficha send the ficha message every 30 seconds
        // for each ficha delete the ficha message after 30 seconds
    },
})
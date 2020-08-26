import * as log from "https://deno.land/std/log/mod.ts";
import { Persistence } from "https://deno.land/x/persistence/persistence.ts"


async function listSpecialEvents() {

    const allEvents = JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/events/events.json`))

    for (const event of allEvents){
        if (event.dances.includes('Bachata')){
            log.warning(`"${event.id}",`)
        }
    }
}


await listSpecialEvents()

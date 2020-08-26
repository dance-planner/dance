import * as log from "https://deno.land/std/log/mod.ts";
import { Persistence } from "https://deno.land/x/persistence/persistence.ts"


async function deleteDuplicatesWithSameExternalLink() {

    const allEvents = JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/events/events.json`))

    const alreadyThereExternalLinks: string[] = []

    const legitimateEvents = []
    for (const event of allEvents){
        if (alreadyThereExternalLinks.includes(event.link)){
            log.error(`Why is there the following duplicate: ${JSON.stringify(event)}?`)
        } else {
            legitimateEvents.push(event)
            alreadyThereExternalLinks.push(event.link)
        }
    }

    log.info(legitimateEvents.length)
    
    await Persistence.saveToLocalFile(`${Deno.cwd()}/events/events.json`, JSON.stringify(legitimateEvents))
}


await deleteDuplicatesWithSameExternalLink()
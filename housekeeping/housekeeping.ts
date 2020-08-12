import { Persistence } from "https://deno.land/x/persistence@1.1.0/persistence.ts"
import * as log from "https://deno.land/std/log/mod.ts";

await correctEventLists()

// await correctTelegramGroups() 

async function correctEventLists(){

    const fileIdEvents = `${Deno.cwd()}/events/events.json`
    const fileIdArchivedEvents = `${Deno.cwd()}/events/events-archive.json`
    const fileIdReportedEvents = `${Deno.cwd()}/events/events-block-list.json`

    const events = JSON.parse(await Persistence.readFromLocalFile(fileIdEvents))
    log.info(`number of events before: ${events.length}`)
    
    let correctedEvents: any = []
    for (const event of events) {
        // space for potential corrections
        correctedEvents.push(event)
    }
    
    log.info(`number of events after: ${events.length}`)
    await Persistence.saveToLocalFile(fileIdEvents, JSON.stringify(correctedEvents))
}

async function correctTelegramGroups(){

    const fileIdTelegramGroups = `${Deno.cwd()}/groups/telegram.json`
    const telegramGroups = JSON.parse(await Persistence.readFromLocalFile(fileIdTelegramGroups))
    console.log(telegramGroups.length)
    
    let correctedGroups: any = []
    for (const group of telegramGroups) {
        // space for potential corrections
        correctedGroups.push(group)
    }
    
    await Persistence.saveToLocalFile(fileIdTelegramGroups, JSON.stringify(correctedGroups))
}
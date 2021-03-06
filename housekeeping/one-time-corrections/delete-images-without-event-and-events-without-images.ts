import { logger } from './../../config.ts'
import { Persistence } from "https://deno.land/x/persistence/persistence.ts"
import { walkSync } from "https://deno.land/std/fs/mod.ts";


async function deleteImagesWithoutEvent() {

    const allEvents = JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/events/events.json`))

    const legitimateEvents: any[] = []

    for (const entry of walkSync(`${Deno.cwd()}/events`)) {
        if (entry.path.includes("dance/events/images/dancing-")) {
            const imageName = entry.path.split('dance/events/images/')[1]
            const eventIdFromImage = imageName.substr(imageName.length - 17, 13)

            const correspondingEvent = allEvents.filter((e: any) => e.id === eventIdFromImage)[0]
            if (correspondingEvent === undefined) {
                logger.error(imageName)
                logger.error(eventIdFromImage)
                await Deno.remove(entry.path)
            } else {
                const legitimateEvent = allEvents.filter((e:any) => e.id === eventIdFromImage)[0]
                if (legitimateEvent === undefined){
                    throw new Error(`hmm - eventIdFromImage: ${eventIdFromImage}`)
                } else {
                    legitimateEvents.push(legitimateEvent)
                }
            }
        }
    }
    logger.info(legitimateEvents.length)

    await Persistence.saveToLocalFile(`${Deno.cwd()}/events/events.json`, JSON.stringify(legitimateEvents))
}


await deleteImagesWithoutEvent()
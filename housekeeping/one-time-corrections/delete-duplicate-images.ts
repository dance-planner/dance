import * as log from "https://deno.land/std/log/mod.ts";
import { walkSync } from "https://deno.land/std/fs/mod.ts";
// import { delete } from "https://deno.land/std/fs/mod.ts";


async function deleteDuplicateImages() {
    let alreadyThereReps: any[] = []
    for (const entry of walkSync(`${Deno.cwd()}/events`)) {
        if (entry.path.includes("dance/events/dancing-")) {
            const shortId = entry.path.substr(0, entry.path.length - 17)
            const stat = await Deno.stat(entry.path)
            // log.warning(stat.size)
            const rep = {
                shortId,
                size: stat.size
            }

            const existingEntry = alreadyThereReps.filter((rep: any) => rep.shortId === shortId && rep.size === stat.size)[0]
            if (existingEntry !== undefined) {
                if (rep.size === existingEntry.size) {
                    log.error(`Why is there the following duplicate: ${shortId} with file size ${rep.size}?`)
                    await Deno.remove(entry.path)
                }
            } else {
                log.info(shortId)
                alreadyThereReps.push(rep)
            }
            // log.info('fine')
        }

    }

}


await deleteDuplicateImages()


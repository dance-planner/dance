import { logger } from './../../config.ts'
import { walkSync } from "https://deno.land/std/fs/mod.ts";
import { move } from "https://deno.land/std/fs/mod.ts";
import { Utilities } from "../../utilities.ts";

async function archiveImagesWithPastDate() {
    const validDates = getValidDates()
    for (const entry of walkSync(`${Deno.cwd()}/events`)) {
        if (entry.path.includes("dance/events/dancing-")) {
            const dateFromImageName = entry.path.split('-on-')[1].substr(0, 10)
            if (dateFromImageName.length === 10 && dateFromImageName.substr(0, 4) === (new Date().getFullYear().toString()) && !validDates.includes(dateFromImageName)) {
                logger.info(dateFromImageName)
                await move(entry.path, `${Deno.cwd()}/events/archived-images/${entry.path.split('dance/events/')[1]}`); 
            }
        }
    }

}

function getValidDates(): string[] {
    let yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    const yesterdayString = Utilities.getIt(yesterday)

    return [yesterdayString].concat(Utilities.getNextXDates(100000))
}


await archiveImagesWithPastDate()


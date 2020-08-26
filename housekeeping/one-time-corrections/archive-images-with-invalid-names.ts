import * as log from "https://deno.land/std/log/mod.ts";
import { walkSync } from "https://deno.land/std/fs/mod.ts";
import { move } from "https://deno.land/std/fs/mod.ts";


async function archiveImagesWithInvalidNames() {
    for (const entry of walkSync(`${Deno.cwd()}/events`)) {
        if (entry.path.includes("dance/events/dancing-")) {
            if (entry.path.includes("undefined")) {
                log.warning(`${entry.path} shall be archived`);
                console.log(`"${entry.path.substr(entry.path.length - 17, 13)}",`)

                await move(entry.path, `${Deno.cwd()}/events/archived-images/${entry.path.split('dance/events/')[1]}`); 
            }
        }

        if (entry.path.includes("dance/events/Dancing-") || entry.path.includes("undefined")) {
            log.error(entry.path);
            throw new Error('shit happened')
        }
    }

}


await archiveImagesWithInvalidNames()


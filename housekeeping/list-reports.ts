import * as log from "https://deno.land/std/log/mod.ts";
import { Persistence } from "https://deno.land/x/persistence/persistence.ts"

async function listReports() {

    const reports = JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/events/reports.json`))

    for (const report of reports){
        log.info(report)
    }
}

await listReports()

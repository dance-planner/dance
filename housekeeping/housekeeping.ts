import { Persistence } from "https://deno.land/x/persistence@1.1.0/persistence.ts"
import * as log from "https://deno.land/std/log/mod.ts";
import { Utilities } from "../utilities.ts";


export class Housekeeping {

    public static async correctEventLists(){

        const fileIdEvents = `${Deno.cwd()}/events/events.json`
        const fileIdArchivedEvents = `${Deno.cwd()}/events/events-archive.json`
        const fileIdReportedEvents = `${Deno.cwd()}/events/events-block-list.json`
        const fileIdReports = `${Deno.cwd()}/events/reports.json`
    
        const events = JSON.parse(await Persistence.readFromLocalFile(fileIdEvents))
        log.info(`number of events before: ${events.length}`)
        
        let yesterday = new Date();
        yesterday.setDate(new Date().getDate() - 1);
        const yesterdayString = Utilities.getIt(yesterday)
        const validDates = [yesterdayString].concat(Utilities.getNextXDates(100000))
    
        log.warning(validDates.length)
        let correctedEvents: any = []
    
        const reports = JSON.parse(await Persistence.readFromLocalFile(fileIdReports))
        log.warning(`number of unique reports: ${reports.length}`)
        
        for (const event of events) {
            if (reports.includes(event.id)) {
                let reportedEvents = JSON.parse(await Persistence.readFromLocalFile(fileIdReportedEvents))
                log.warning(`number of reportedEvents before: ${reportedEvents.length}`)
                reportedEvents.push(event)
                await Persistence.saveToLocalFile(fileIdReportedEvents, JSON.stringify(reportedEvents))
                log.info(`number of reported events after: ${reportedEvents.length}`)
            } else if (validDates.includes(event.startDate)){
                // space for potential corrections
                correctedEvents.push(event)
            } else {
                const archivedEvents = JSON.parse(await Persistence.readFromLocalFile(fileIdArchivedEvents))
                log.info(`number of archived events before: ${archivedEvents.length}`)
                archivedEvents.push(event)
                log.warning(`archiving event with startDate: ${event.startDate}`)
                await Persistence.saveToLocalFile(fileIdArchivedEvents, JSON.stringify(archivedEvents))
                log.info(`number of archived events after: ${archivedEvents.length}`)
            }
        }
        
        log.info(`number of events after: ${correctedEvents.length}`)
        await Persistence.saveToLocalFile(fileIdEvents, JSON.stringify(correctedEvents))
    }
    
    public static async  correctTelegramGroups(){
    
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
}


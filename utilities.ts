import { serialize } from "https://raw.githubusercontent.com/olaven/serialize-xml/v0.3.2/mod.ts"
import * as log from "https://deno.land/std/log/mod.ts";

export class Utilities {

    public static getNextXDates(numberOfDays: number): string[] {
        let counter = 0
        var today = new Date();


        let arrayOfDates = []
        while (counter < numberOfDays) {
            var itDate = new Date();
            itDate.setDate(today.getDate() + counter);
            arrayOfDates.push(Utilities.getIt(itDate))

            counter += 1
        }

        return arrayOfDates

    }

    private static getIt(date: any) {
        let day = date.getUTCDate().toString()
        let month = (date.getMonth() + 1).toString()
        let year = date.getUTCFullYear()

        if (day.length === 1) {
            day = `0${day}`
        }

        if (month.length === 1) {
            month = `0${month}`
        }
        const it = `${year}-${month}-${day}`

        return it

    }


}
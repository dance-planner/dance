import { serialize } from "https://raw.githubusercontent.com/olaven/serialize-xml/v0.3.2/mod.ts"
import * as log from "https://deno.land/std/log/mod.ts";
import { CityService } from "https://deno.land/x/cities/cityservice.ts"
import { DistanceCalculator } from "https://deno.land/x/distancecalculator@1.0.0/distance-calculator.ts";

export class Utilities {


    public static getClosestEntry(items: any[], lat: number, lon: number): any {

        let itemsWithDistance = Utilities.enrichDistance(items, lat, lon)

        let sortedItemsWithDistance = Utilities.sortByDistance(itemsWithDistance)

        return sortedItemsWithDistance[0]
    }

    public static sortByDistance(groups: any[]): any[] {
        return groups.sort((c1, c2) => {
            if (c1.distance > c2.distance) {
                return 1
            }

            if (c1.distance < c2.distance) {
                return -1
            }

            return 0
        })
    }

    public static enrichDistance(items: any[], latUser: number, lonUser: number): any[] {

        for (const e of items) {
            if (e.countryCode === '' || e.cityName === '') {
                e.distance = 1000000
            } else {

                const city = CityService.getCityInfo(e.countryCode, e.cityName)

                if (city === undefined) {
                    e.distance === 10000
                } else {
                    e.distance = DistanceCalculator.getDistanceInKilometers(latUser, lonUser, city.lat, city.lon)
                }
            }
        }

        return items
    }

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

    public static getIt(date: any) {
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
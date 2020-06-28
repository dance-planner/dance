import { DancesProvider } from "./dancesprovider.ts"

// import { DancesProvider } from "https://deno.land/x/dance/dancesprovider.ts"
// import { DancesProvider } from "https://raw.githubusercontent.com/michael-spengler/dance/master/dancesprovider.ts"

const result = DancesProvider.getAllDances()
console.log(`The name of the card is ${result}`)



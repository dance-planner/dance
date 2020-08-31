
import { Persistence } from "https://deno.land/x/persistence@v1.3.0/persistence.ts"
import { Logger }  from 'https://deno.land/x/log@v0.6.1/mod.ts'

const pathToConfig = await Persistence.readFromLocalFile(`${Deno.cwd()}/topsecret/.env.json`)
export const config = JSON.parse(pathToConfig)

export const logger = await Logger.getInstance(config.minLevelForConsole, config.minLevelForFile, "./warnings-errors.txt")

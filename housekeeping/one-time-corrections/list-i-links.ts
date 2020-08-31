

import { Persistence } from "https://deno.land/x/persistence/persistence.ts"
// import { Request } from "https://deno.land/x/request@1.1.0/request.ts"
import { sleepRandomAmountOfSeconds } from "https://deno.land/x/sleep/mod.ts"
// import { telegramBotToken } from "../../topsecret/.env.ts"
import { logger } from './../../config.ts'

async function listILinks() {

    const groups = JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/groups/telegram.json`))

    let counter = 0
    for (const group of groups){
        counter += 1
        logger.debug(counter)
        logger.info(group.cityName)
        const newDescription = `Please share this invitation link: https://dance-planner.org/?group=${group.dpId}`
        logger.warning(newDescription)
        await sleepRandomAmountOfSeconds(7, 11)


        // const getChatURL = `https://api.telegram.org/bot${telegramBotToken}/getChat?chat_id=${group.chatId}`

        // let response = await Request.get(getChatURL)
        
        // if (response.result.description === undefined) {
        //     logger.info(`setting description to: ${newDescription}`)
        //     const setDescriptionURL = `https://api.telegram.org/bot${telegramBotToken}/setChatDescription?chat_id=${group.chatId}&description=${newDescription}`
        //     response = await Request.get(setDescriptionURL)
        // } else {
        //     logger.info(`description was already there: ${response.result.description}`)
        // }
    }
}

await listILinks()

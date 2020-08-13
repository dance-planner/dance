import {cron } from 'https://deno.land/x/deno_cron/cron.ts';
import * as log from "https://deno.land/std/log/mod.ts";
import { CommandLineProcessor } from "https://deno.land/x/commandline_processor/commandline-processor.ts"


cron('0 * * * * *', async () => {
    log.info('pulling the latest fancy shit from github')
    console.log(await CommandLineProcessor.process('git stash'))
    console.log(await CommandLineProcessor.process('git pull'))
});
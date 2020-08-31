import {hourly} from 'https://deno.land/x/deno_cron/cron.ts';
import { logger } from './../config.ts'
import { Housekeeping } from './housekeeping.ts';

await Housekeeping.correctEventLists()

hourly(async () => {
    logger.warning('housekeeping :)')
    await Housekeeping.correctEventLists()
});
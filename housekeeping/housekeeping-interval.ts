import {hourly} from 'https://deno.land/x/deno_cron/cron.ts';
import * as log from "https://deno.land/std/log/mod.ts";
import { Housekeeping } from './housekeeping.ts';

hourly(async () => {
    log.warning('housekeeping :)')
    await Housekeeping.correctEventLists()
});
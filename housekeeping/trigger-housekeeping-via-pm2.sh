pm2 start housekeeping/trigger-housekeeping.ts --interpreter="deno" --interpreter-args="run --allow-net --allow-read --allow-write --allow-run --unstable"
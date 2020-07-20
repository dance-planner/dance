# Dance Module

## Usage example for your code

```

import { DancesProvider } from "https://deno.land/x/dance/dancesprovider.ts"


const result = DancesProvider.getAllDances()
console.log(`\nFeel free to extend this list via pull requests: \n${result}\n`)

const heidelbergGeo = {
    latitude: 49.40768,
    longitude: 8.69079
}

const radius = 18
const events = DancesProvider.getDanceEvents(heidelbergGeo, radius)
console.log(`\nDance Events in the radius of ${radius} kilometers: \n${JSON.stringify(events)}\n`)


```

## Test it via command line
```

deno run --allow-net --allow-read https://deno.land/x/dance/test-it.ts

```

## Contributions are welcome
Feel free to create a pull request if you would like to improve things. 

## Background to this module
I developed the Dance Planner - https://dance-planner.org/ and I want to prepare its way into the deno.land :) 

## Link to this third party module at deno
https://deno.land/x/dance

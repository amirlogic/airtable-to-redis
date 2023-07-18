# Airtable to Redis

This module fetches data from Airtable and stores it into Redis in JSON format

Installation: `npm i airtable-to-redis`

```typescript
const { connectRedis, getApiData, redTokens, dataToRedis } = require('airtable-to-redis')

const TOKEN_KEY = 'airtable.auth'

const BASE_ID = 'appXXXX'

const TABLE_ID = 'tblXXX'

connectRedis({redisUrl:'redis://user:pass@server-host:port'})
.then(async()=>{

    try{

        let [ authtoken, refreshtoken ] = await redTokens(TOKEN_KEY)
        console.log(authtoken,' ',refreshtoken)

        return getApiData({apikey:authtoken, base:BASE_ID, tbl:TABLE_ID})  

    }
    catch(errc){

        if(errc === 401){

            console.log('Invalid auth token, try refreshing')
        }
        else{

            console.error('API error: ',errc)
        }
    }
})
.then((atdata)=>{

    dataToRedis(TABLE_ID,atdata)
        .then((resp)=>{

            console.log(resp)
        })
        .catch((err)=>{

            console.error(err)
        })

})
.catch((err)=>{

    console.error(err)
})
```

The redis server must have JSON module installed

If the redis server requires a secure connection, use `rediss://`

Authentication: oAuth token is used to connect to Airtable API

If you need to generate tokens, you can use: https://github.com/amirlogic/airtable-oauth-redis/




const redis = require('redis');
let redcli;

const Airtable = require('airtable');

const connectRedis = (config={})=>{

    return new Promise((resolve,reject)=>{

        redcli = redis.createClient({
            url: config?.redisUrl
        });

        redcli.on('error', (err) => { 
            
            reject(err)
            console.error('Redis Client Error', err)
        } );

        redcli.on('ready', () => console.log('Redis client is ready'));

        redcli.connect()
            .then(()=>{

                resolve()
            })
            .catch((cerr)=>{

                reject(cerr)
            })
    })
}

/* const authTokens = ()=>{
} */

const getApiData = (req={})=>{

    let base = new Airtable({apiKey: req?.apikey}).base(req?.base);

    // testing

    return new Promise((resolve,reject)=>{

        base(req?.tbl).select({
            view: 'Grid view'

        }).firstPage(function(err, records) {

            if (err) { 
                //console.error(err);
                reject(err.statusCode)
                return; 
            }

            let tbldata = []

            records.forEach(function(record) {

                tbldata.push(record.fields)
                //console.log(record.id,' ',record.fields);

            });

            resolve(tbldata)
        });

    })

       
}

const redTokens = (redkey='null')=>{

    return new Promise((resolve,reject)=>{

        redcli
        .multi()
            .get(redkey)
            .get(`${redkey}.refresh`)
        .exec()
        .then((resp)=>{

            resolve(resp)
        })
        .catch((err)=>{

            reject(err)
        })
    })
    

}

const dataToRedis = (key='null',atdata=[])=>{

    return redcli.json.set(key, '$', atdata);
}

const redisData = (key='null')=>{

    return redcli.json.get(key);
}

const refreshToken = ()=>{


}

module.exports = { connectRedis, getApiData, dataToRedis, refreshToken, redTokens, redisData, redcli }
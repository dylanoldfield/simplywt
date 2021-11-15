import { AccessError, RedisError }from './error';
import { checkDb } from './setupFunc';
import {createClient} from 'redis';
import {DB_PATH} from '../config.json';
//redis setup
const redisPort = process.env.REDIS_PORT || 6379;
const client = createClient(redisPort);

client.on('error', (err) => { throw new RedisError(err); });


// Generic DB query function -> in reality probably would adjust caching parameters depending on calls made
const dbQuery = async (query) => {
  // first check redis for the data
  const db = checkDb(DB_PATH);
  console.log(query);
  try {
    await client.connect();
    const value = await client.get(query)
    console.log("redis ",JSON.parse(value));
    if (value) {
        client.quit();
        db.close();
        return JSON.parse(value); 
    } else {
        const result = await db.prepare(query).all();
        
        // don't need to wait for redis to set the cache
        client.set(query, JSON.stringify(result));
        client.quit();
        db.close();
        return result;
    }
  } catch (err) {
    console.log(err);
    client.quit();
    db.close();
    throw new AccessError(err);
    
  }
};


// SQL query paramters
const queryLimit = 15;
const orderBy = {
  'volAsc' : `V.price_vol asc`,
  'volDsc' : `V.price_vol desc`,
  'scoreAsc' : `T.total asc`,
  'scoreDsc' : `T.total desc`,
  'nothing' : `C.name`
}

/*
  Get Functions
*/


export const getStockNum = async () => { 
  return await dbQuery(`Select count(name) from swsCompany`)
};

export const getStocks = async ({order, index}) => { 
  return await dbQuery( `
  Select C.name as Name, C.unique_symbol as Ticker, P.price as Price, T.total as Score, V.price_vol as 'Price Volatility' 
  from swsCompany C INNER join (
      SELECT company_id, price, max(date) 
      from swsCompanyPriceClose
      group by (company_id)
  )P on C.id = P.company_id 
  INNER Join swsCompanyScore T on C.id = T.company_id
  INNER Join swsCompanyPriceVol V on C.id = V.company_id
  ORDER BY ${orderBy[order]}
  Limit ${queryLimit} OFFSET ${index}
`)};







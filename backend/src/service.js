import { AccessError, RedisError }from './error';
import { checkDb } from './setupFunc';
import {createClient} from 'redis';

//redis setup
const redisPort = process.env.REDIS_PORT || 6379;
const client = createClient(redisPort);

client.on('error', (err) => { throw new RedisError(err); });

// SQL queries
const queryLimit = 15;
const orderBy = {
  'volAsc' : `V.price_vol asc`,
  'volDesc' : `V.price_vol desc`,
  'scoreAsc' : `T.total asc`,
  'scoreDesc' : `T.total desc`,
  'nothing' : `C.name`
}

const getStocksQuery = (order = orderBy.nothing, limit = queryLimit, index = 0) => { return `
  Select C.name as Name, C.unique_symbol as Ticker, P.price as Price, T.total as Score, V.price_vol as 'Price Volatility' 
  from swsCompany C INNER join (
      SELECT company_id, price, max(date) 
      from swsCompanyPriceClose
      group by (company_id)
  )P on C.id = P.company_id 
  INNER Join swsCompanyScore T on C.id = T.company_id
  INNER Join swsCompanyPriceVol V on C.id = V.company_id
  ORDER BY ${order}
  Limit ${limit} OFFSET ${index}

`};
// Get functions
export const getStocks = async (index, order = 'nothing') => {
    // first check redis for the data
    const db = checkDb('./sws.sqlite3');
    const query = getStocksQuery(orderBy[order], queryLimit, index);

    try {
      await client.connect();
      const value = await client.get(query)
      console.log(JSON.parse(value));
      if (value) {
        client.quit();
        return JSON.parse(value);   
      } else {
        const stocks = await db.prepare(query).all();
        
        // don't need to await for redis to set the cache\
        console.log(stocks);
        client.set(query, JSON.stringify(stocks));
        client.quit();
        return stocks;
    }
  } catch (err) {
    console.log(err);
    client.quit();
    throw new AccessError(err);
    
  }
};
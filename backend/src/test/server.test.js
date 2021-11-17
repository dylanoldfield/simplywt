import server from '../server';
import request from 'supertest';
import Database from 'better-sqlite3';
import {DB_PATH} from '../../config.json';
/*
    Expected values
*/



const COUNT = {
    count: 12
}

const INDEX_0 =     {
    "stocks": [
      {
        "Name": "Afterpay",
        "Ticker": "ASX:APT",
        "Price": 44.51,
        "Score": 9,
        "Price Volatility": 0.3027435936294057
      },
      {
        "Name": "Alibaba Group Holding",
        "Ticker": "NYSE:BABA",
        "Price": 199.7,
        "Score": 13,
        "Price Volatility": 0.04088300619072286
      },
      {
        "Name": "Amazon.com",
        "Ticker": "NasdaqGS:AMZ",
        "Price": 2436.88,
        "Score": 13,
        "Price Volatility": 0.08878482190358017
      },
      {
        "Name": "Apple",
        "Ticker": "NasdaqGS:AAPL",
        "Price": 318.89,
        "Score": 9,
        "Price Volatility": 0.08404336737934015
      },
      {
        "Name": "BHP Group",
        "Ticker": "ASX:BHP",
        "Price": 34.32,
        "Score": 12,
        "Price Volatility": 0.046470464440739365
      },
      {
        "Name": "Delta Air Lines",
        "Ticker": "NYSE:DAL",
        "Price": 22.69,
        "Score": 15,
        "Price Volatility": 0.12037631419764092
      },
      {
        "Name": "Facebook",
        "Ticker": "NasdaqGS:FB",
        "Price": 234.91,
        "Score": 11,
        "Price Volatility": 0.11950919078920318
      },
      {
        "Name": "Microsoft",
        "Ticker": "NasdaqGS:MSFT",
        "Price": 183.51,
        "Score": 18,
        "Price Volatility": 0.0644409724935881
      },
      {
        "Name": "Pfizer",
        "Ticker": "NYSE:PFE",
        "Price": 37.5,
        "Score": 20,
        "Price Volatility": 0.06443477456696696
      },
      {
        "Name": "Telstra",
        "Ticker": "ASX:TLS",
        "Price": 3.06,
        "Score": 10,
        "Price Volatility": 0.017974640351487856
      },
      {
        "Name": "Tesla",
        "Ticker": "NasdaqGS:TSLA",
        "Price": 816.88,
        "Score": 11,
        "Price Volatility": 0.17557874912272353
      },
      {
        "Name": "Walt Disney",
        "Ticker": "NYSE:DIS",
        "Price": 118.02,
        "Score": 8,
        "Price Volatility": 0.058911305863646506
      }
    ]
  }

const INDEX_10 = {
    "stocks": [
      {
        "Name": "Tesla",
        "Ticker": "NasdaqGS:TSLA",
        "Price": 816.88,
        "Score": 11,
        "Price Volatility": 0.17557874912272353
      },
      {
        "Name": "Walt Disney",
        "Ticker": "NYSE:DIS",
        "Price": 118.02,
        "Score": 8,
        "Price Volatility": 0.058911305863646506
      }
    ]
  }

const SCORE_SORTED_ASC = {
    "stocks": [
      {
        "Name": "Walt Disney",
        "Ticker": "NYSE:DIS",
        "Price": 118.02,
        "Score": 8,
        "Price Volatility": 0.058911305863646506
      },
      {
        "Name": "Afterpay",
        "Ticker": "ASX:APT",
        "Price": 44.51,
        "Score": 9,
        "Price Volatility": 0.3027435936294057
      },
      {
        "Name": "Apple",
        "Ticker": "NasdaqGS:AAPL",
        "Price": 318.89,
        "Score": 9,
        "Price Volatility": 0.08404336737934015
      },
      {
        "Name": "Telstra",
        "Ticker": "ASX:TLS",
        "Price": 3.06,
        "Score": 10,
        "Price Volatility": 0.017974640351487856
      },
      {
        "Name": "Tesla",
        "Ticker": "NasdaqGS:TSLA",
        "Price": 816.88,
        "Score": 11,
        "Price Volatility": 0.17557874912272353
      },
      {
        "Name": "Facebook",
        "Ticker": "NasdaqGS:FB",
        "Price": 234.91,
        "Score": 11,
        "Price Volatility": 0.11950919078920318
      },
      {
        "Name": "BHP Group",
        "Ticker": "ASX:BHP",
        "Price": 34.32,
        "Score": 12,
        "Price Volatility": 0.046470464440739365
      },
      {
        "Name": "Alibaba Group Holding",
        "Ticker": "NYSE:BABA",
        "Price": 199.7,
        "Score": 13,
        "Price Volatility": 0.04088300619072286
      },
      {
        "Name": "Amazon.com",
        "Ticker": "NasdaqGS:AMZ",
        "Price": 2436.88,
        "Score": 13,
        "Price Volatility": 0.08878482190358017
      },
      {
        "Name": "Delta Air Lines",
        "Ticker": "NYSE:DAL",
        "Price": 22.69,
        "Score": 15,
        "Price Volatility": 0.12037631419764092
      },
      {
        "Name": "Microsoft",
        "Ticker": "NasdaqGS:MSFT",
        "Price": 183.51,
        "Score": 18,
        "Price Volatility": 0.0644409724935881
      },
      {
        "Name": "Pfizer",
        "Ticker": "NYSE:PFE",
        "Price": 37.5,
        "Score": 20,
        "Price Volatility": 0.06443477456696696
      }
    ]
  }

const SCORE_SORTED_DESC = {
    "stocks": [
      {
        "Name": "Pfizer",
        "Ticker": "NYSE:PFE",
        "Price": 37.5,
        "Score": 20,
        "Price Volatility": 0.06443477456696696
      },
      {
        "Name": "Microsoft",
        "Ticker": "NasdaqGS:MSFT",
        "Price": 183.51,
        "Score": 18,
        "Price Volatility": 0.0644409724935881
      },
      {
        "Name": "Delta Air Lines",
        "Ticker": "NYSE:DAL",
        "Price": 22.69,
        "Score": 15,
        "Price Volatility": 0.12037631419764092
      },
      {
        "Name": "Amazon.com",
        "Ticker": "NasdaqGS:AMZ",
        "Price": 2436.88,
        "Score": 13,
        "Price Volatility": 0.08878482190358017
      },
      {
        "Name": "Alibaba Group Holding",
        "Ticker": "NYSE:BABA",
        "Price": 199.7,
        "Score": 13,
        "Price Volatility": 0.04088300619072286
      },
      {
        "Name": "BHP Group",
        "Ticker": "ASX:BHP",
        "Price": 34.32,
        "Score": 12,
        "Price Volatility": 0.046470464440739365
      },
      {
        "Name": "Facebook",
        "Ticker": "NasdaqGS:FB",
        "Price": 234.91,
        "Score": 11,
        "Price Volatility": 0.11950919078920318
      },
      {
        "Name": "Tesla",
        "Ticker": "NasdaqGS:TSLA",
        "Price": 816.88,
        "Score": 11,
        "Price Volatility": 0.17557874912272353
      },
      {
        "Name": "Telstra",
        "Ticker": "ASX:TLS",
        "Price": 3.06,
        "Score": 10,
        "Price Volatility": 0.017974640351487856
      },
      {
        "Name": "Apple",
        "Ticker": "NasdaqGS:AAPL",
        "Price": 318.89,
        "Score": 9,
        "Price Volatility": 0.08404336737934015
      },
      {
        "Name": "Afterpay",
        "Ticker": "ASX:APT",
        "Price": 44.51,
        "Score": 9,
        "Price Volatility": 0.3027435936294057
      },
      {
        "Name": "Walt Disney",
        "Ticker": "NYSE:DIS",
        "Price": 118.02,
        "Score": 8,
        "Price Volatility": 0.058911305863646506
      }
    ]
  }

const VOL_SORTED_ASC = {
    "stocks": [
      {
        "Name": "Telstra",
        "Ticker": "ASX:TLS",
        "Price": 3.06,
        "Score": 10,
        "Price Volatility": 0.017974640351487856
      },
      {
        "Name": "Alibaba Group Holding",
        "Ticker": "NYSE:BABA",
        "Price": 199.7,
        "Score": 13,
        "Price Volatility": 0.04088300619072286
      },
      {
        "Name": "BHP Group",
        "Ticker": "ASX:BHP",
        "Price": 34.32,
        "Score": 12,
        "Price Volatility": 0.046470464440739365
      },
      {
        "Name": "Walt Disney",
        "Ticker": "NYSE:DIS",
        "Price": 118.02,
        "Score": 8,
        "Price Volatility": 0.058911305863646506
      },
      {
        "Name": "Pfizer",
        "Ticker": "NYSE:PFE",
        "Price": 37.5,
        "Score": 20,
        "Price Volatility": 0.06443477456696696
      },
      {
        "Name": "Microsoft",
        "Ticker": "NasdaqGS:MSFT",
        "Price": 183.51,
        "Score": 18,
        "Price Volatility": 0.0644409724935881
      },
      {
        "Name": "Apple",
        "Ticker": "NasdaqGS:AAPL",
        "Price": 318.89,
        "Score": 9,
        "Price Volatility": 0.08404336737934015
      },
      {
        "Name": "Amazon.com",
        "Ticker": "NasdaqGS:AMZ",
        "Price": 2436.88,
        "Score": 13,
        "Price Volatility": 0.08878482190358017
      },
      {
        "Name": "Facebook",
        "Ticker": "NasdaqGS:FB",
        "Price": 234.91,
        "Score": 11,
        "Price Volatility": 0.11950919078920318
      },
      {
        "Name": "Delta Air Lines",
        "Ticker": "NYSE:DAL",
        "Price": 22.69,
        "Score": 15,
        "Price Volatility": 0.12037631419764092
      },
      {
        "Name": "Tesla",
        "Ticker": "NasdaqGS:TSLA",
        "Price": 816.88,
        "Score": 11,
        "Price Volatility": 0.17557874912272353
      },
      {
        "Name": "Afterpay",
        "Ticker": "ASX:APT",
        "Price": 44.51,
        "Score": 9,
        "Price Volatility": 0.3027435936294057
      }
    ]
  }

const VOL_SORTED_DESC = {
    "stocks": [
      {
        "Name": "Afterpay",
        "Ticker": "ASX:APT",
        "Price": 44.51,
        "Score": 9,
        "Price Volatility": 0.3027435936294057
      },
      {
        "Name": "Tesla",
        "Ticker": "NasdaqGS:TSLA",
        "Price": 816.88,
        "Score": 11,
        "Price Volatility": 0.17557874912272353
      },
      {
        "Name": "Delta Air Lines",
        "Ticker": "NYSE:DAL",
        "Price": 22.69,
        "Score": 15,
        "Price Volatility": 0.12037631419764092
      },
      {
        "Name": "Facebook",
        "Ticker": "NasdaqGS:FB",
        "Price": 234.91,
        "Score": 11,
        "Price Volatility": 0.11950919078920318
      },
      {
        "Name": "Amazon.com",
        "Ticker": "NasdaqGS:AMZ",
        "Price": 2436.88,
        "Score": 13,
        "Price Volatility": 0.08878482190358017
      },
      {
        "Name": "Apple",
        "Ticker": "NasdaqGS:AAPL",
        "Price": 318.89,
        "Score": 9,
        "Price Volatility": 0.08404336737934015
      },
      {
        "Name": "Microsoft",
        "Ticker": "NasdaqGS:MSFT",
        "Price": 183.51,
        "Score": 18,
        "Price Volatility": 0.0644409724935881
      },
      {
        "Name": "Pfizer",
        "Ticker": "NYSE:PFE",
        "Price": 37.5,
        "Score": 20,
        "Price Volatility": 0.06443477456696696
      },
      {
        "Name": "Walt Disney",
        "Ticker": "NYSE:DIS",
        "Price": 118.02,
        "Score": 8,
        "Price Volatility": 0.058911305863646506
      },
      {
        "Name": "BHP Group",
        "Ticker": "ASX:BHP",
        "Price": 34.32,
        "Score": 12,
        "Price Volatility": 0.046470464440739365
      },
      {
        "Name": "Alibaba Group Holding",
        "Ticker": "NYSE:BABA",
        "Price": 199.7,
        "Score": 13,
        "Price Volatility": 0.04088300619072286
      },
      {
        "Name": "Telstra",
        "Ticker": "ASX:TLS",
        "Price": 3.06,
        "Score": 10,
        "Price Volatility": 0.017974640351487856
      }
    ]
  }

const VOL_SORTED_DESC_INDEX_10 = {
    "stocks": [
      {
        "Name": "Alibaba Group Holding",
        "Ticker": "NYSE:BABA",
        "Price": 199.7,
        "Score": 13,
        "Price Volatility": 0.04088300619072286
      },
      {
        "Name": "Telstra",
        "Ticker": "ASX:TLS",
        "Price": 3.06,
        "Score": 10,
        "Price Volatility": 0.017974640351487856
      }
    ]
  }

const getTry = async(path, status) => {
    const req = request(server).get(path);
    const response = await req.send();
    expect(response.statusCode).toBe(status);
    return response;
}



describe('Get number of stocks in DB', () => {
    let db;

    beforeAll(async() => {
        db = await new Database(DB_PATH,{fileMustExist:true})
      })
      
      afterAll(async() => {
        // Closing the DB connection allows Jest to exit successfully.
        await db.close()
      })

    it('should return 12', async() => {
        const reponse = await getTry('/stocks/number', 200);
        const data = await JSON.parse(reponse.text); ;
        const {number} = data;
        return expect(number[0]['count(name)']).toBe(COUNT.count);
    })
});

describe('Testing suite for Get calls', () => {
    let db;

    beforeAll(async() => {
        db = await new Database(DB_PATH,{fileMustExist:true})
      })
      
      afterAll(async() => {
        // Closing the DB connection allows Jest to exit successfully.
        await db.close()
        server.close();
      })

    it('should return all 12 stocks', async() => {
        const reponse = await getTry('/stocks/0', 200);
        const data = await JSON.parse(reponse.text); ;
        const {stocks} = data;
        return expect(stocks).toStrictEqual(INDEX_0.stocks);
    })

    it('should return only the last 2 stocks', async() => {
        const reponse = await getTry('/stocks/10', 200);
        const data = await JSON.parse(reponse.text); ;
        const {stocks} = data;
        return expect(stocks).toStrictEqual(INDEX_10.stocks);
    })
    
    it('should return only the score sorted ASC stocks', async() => {
        const reponse = await getTry('/stocks/0/sorted/scoreAsc', 200);
        const data = await JSON.parse(reponse.text); ;
        const {stocks} = data;
        return expect(stocks).toStrictEqual(SCORE_SORTED_ASC.stocks);
    })

    it('should return only the score sorted DSC stocks', async() => {
        const reponse = await getTry('/stocks/0/sorted/scoreDsc', 200);
        const data = await JSON.parse(reponse.text); ;
        const {stocks} = data;
        return expect(stocks).toStrictEqual(SCORE_SORTED_DESC.stocks);
    })

    it('should return only the vol sorted ASC stocks', async() => {
        const reponse = await getTry('/stocks/0/sorted/volAsc', 200);
        const data = await JSON.parse(reponse.text); ;
        const {stocks} = data;
        return expect(stocks).toStrictEqual(VOL_SORTED_ASC.stocks);
    })

    it('should return only the vol sorted DSC stocks', async() => {
        const reponse = await getTry('/stocks/0/sorted/volDsc', 200);
        const data = await JSON.parse(reponse.text); ;
        const {stocks} = data;
        return expect(stocks).toStrictEqual(VOL_SORTED_DESC.stocks);
    })

    it('should return only the last 2 vol sorted DSC stocks', async() => {
        const reponse = await getTry('/stocks/10/sorted/volDsc', 200);
        const data = await JSON.parse(reponse.text); ;
        const {stocks} = data;
        return expect(stocks).toStrictEqual(VOL_SORTED_DESC_INDEX_10.stocks);
    })

    it('bad url', async() => {
        await getTry('/stocks/blah', 403);
    })


});


import Database from 'better-sqlite3';
import { create, all} from 'mathjs';
import { setUpError } from './error';

// create a mathjs instance
const math = create(all)

// checks if that database exists
export function checkDb (path) { 
    try { 
        return new Database(path,{fileMustExist:true}); 
    }
    catch(err) { 
        throw new setUpError("Database file not found - make sure database 'sws.sqlite3' in src");
    }
};

// this function will calculate and return an object with the price volatilities of the stocks
export function addPriceVol (rows){
    // extract the historial price data
    const histPrices = {};

    rows.map(row => {
        if (!histPrices[row.company_id]) {
            histPrices[row.company_id] = [];
        }
        histPrices[row.company_id].push(row.price);
        }
    );

    // calulate normalised price volatility using std/mean as measure
    const zscores = {};
    //calc normalised stds 
    for(const company_id in histPrices) {
        zscores[company_id] = math.std(histPrices[company_id])/math.mean(histPrices[company_id]);
    }
    return zscores;
}

// function formats SQL index query
export function createIndex (indexName, tableName, indexOn) {
    return `CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${indexOn});`;
}
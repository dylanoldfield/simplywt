import Database from 'better-sqlite3';
import { create, all } from 'mathjs'

// create a mathjs instance
const math = create(all)

// checks if that database exists
export function checkDb (path) { 
    try { 
        return new Database(path,{fileMustExist:true}); 
    }
    catch(err) { 
        console.log('No Database found'); 
        console.log(err);
        process.exit(0);
    }
};

// this function will calculate and return an object with the price volatilities of the stocks
export function addPriceVol (rows){
    // extract the historial price data
    const histPrices = {};

    console.log(rows);
    for(p_row of rows) {  
    if (!histPrices[p_row.company_id]) {
        histPrices[p_row.company_id] = [];
    }
    histPrices[p_row.company_id].push(p_row.price);
    }

    // calulate nomralised price volatility using std/mean as measure
    const zscores = {};
    //calc normalised stds 
    for(company_id in histPrices) {
    zscores[company_id] = math.std(histPrices[company_id])/math.mean(histPrices[company_id]);
    }
    return zscores;
}
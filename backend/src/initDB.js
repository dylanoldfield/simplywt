import { checkDb , addPriceVol, createIndex } from './setupFunc.js';
import {setUpError} from './error.js';
import indices from './indices.js'

/*
    This function is used for preprocessing the database on a clean load. 
    It will check all the tables exist and create the appropriate indexes for them.
*/
function init (){
    // check if db exists otherwise exists
    const db = checkDb('./sws.sqlite3');
    console.log("Database found");

    // check if tables exist
    const tables = ['swsCompany', 'swsCompanyPriceClose', 'swsCompanyScore'];
    const tableExist = db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name= (?)");

    tables.map(table => {
        if (!tableExist.get(table)) {
            throw new setUpError(`Table ${table} does not exist`);
        }
    });

   
    /*
        This segment creates a new table storing price volatility for each name. 
        Note: used complete history since less than 90 days provided

        also add two indexes one for joins and the other for sorting on price vol
    */
    if(!tableExist.get('swsCompanyPriceVol')){
        const prices = db.prepare('SELECT company_id, price, date FROM swsCompanyPriceClose').all();
        if(!prices) throw new setUpError('No prices found in swsCompanyPriceClose');

        const zscores = addPriceVol(prices);
        if (!zscores) throw new setUpError('Error adding price volatility - zscores empty');

        db.prepare('CREATE TABLE swsCompanyPriceVol (company_id UNIQUEIDENTIFIER PRIMARY KEY, price_vol FLOAT, FOREIGN KEY (company_id) REFERENCES swsCompany (id))').run();

        for(const company_id in zscores) {   
            db.prepare('INSERT INTO swsCompanyPriceVol (company_id, price_vol) VALUES (?, ?)').run(company_id, zscores[company_id]);
        }
        console.log('Price volatility table added');
    }

    /*
        Create cover indices for the tables
        - idx on id and score id/copmany_id to allow for faster joins, name and unique symbol as cover
        - create idx on score since that is sortable field also create one of id for faster joins
        - create idx on company id for joins with score as cover
        - create priceVol indices for joins and sorting
    */

    for(const index in indices){
        const {tableName, fields} = indices[index];
        db.prepare(createIndex(index, tableName, fields)).run();
    }

    // Lastly convert the DB to WAL mode to allow for concurrent access -> kept WAL checkpointing at default in reality would probably need performance tuning
    db.prepare('PRAGMA journal_mode = WAL').run();
    console.log('Indices prepared');
    console.log('Database Initialisation complete..')
}

export default init;
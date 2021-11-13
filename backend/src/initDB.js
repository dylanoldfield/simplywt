import { map } from 'mathjs';
import { checkDb , addPriceVol } from './setupFunc.js';

/*
    This function is used for preprocessing the database on a clean load. 
    It will check all the tables exist and create the appropriate indexes for them.
*/
function init (){
        // check if db exists otherwise exits
    const db = checkDb('./sws.sqlite3');
    if (!db) process.exit(0);

    // check if tables are correct
    const tableExist = db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name= (?)");
    const tables = ['swsCompany', 'swsCompanyPriceClose', 'swsCompanyScore']

   // check if all tables exist
    tables.map(table => {
        if (!tableExist.get(table)) {
            console.log(`Table ${table} does not exist`);
            process.exit(0);
        }
    });
    //check if all the tables exist
    // tableExist.get('swsCompany') ? '' : console.log('swsCompany table does not exist') && process.exit(0);
    // tableExist.get('swsCompanyPriceClose') ? '' : console.log('swsCompanyPriceClose table does not exist') && process.exit(0);
    // tableExist.get('swsCompanyScore') ? '' : console.log('swsCompanyScore table does not exist') && process.exit(0);

    // create cover indexes for the tables
    // idx on id and score id to allow for faster joins, name and unique symbol as cover
    db.prepare("CREATE INDEX IF NOT EXISTS Company_id ON swsCompany ( id ASC, name, unique_symbol)").run();
    // idx on id for prices, date descending (quicker to get last)
    db.prepare("CREATE INDEX IF NOT EXISTS PriceClose_id ON swsCompanyPriceClose ( company_id ASC, date DESC, price)").run();
    // create idx on score since that is sortable field also create one of id for faster joins
    db.prepare("CREATE INDEX IF NOT EXISTS CompanyScore_score ON swsCompanyScore (total ASC, company_id ASC)").run();
    db.prepare("CREATE INDEX IF NOT EXISTS CompanyScore_id ON swsCompanyScore (company_id ASC, total ASC)").run();
    console.log('Indexes prepared');

    // add zscore table if it doesn't exist
    if(!tableExist.get('swsCompanyPriceVol')){
        const prices = db.prepare('SELECT company_id, price, date FROM swsCompanyPriceClose').all();
        const zscores = addPriceVol(prices);
        // add new table
        db.prepare('CREATE TABLE swsCompanyPriceVol (company_id INTEGER UNIQUE, price_vol FLOAT)').run();
        // populate table
        for(company_id in zscores) {   
            db.prepare('INSERT INTO swsCompanyPriceVol (company_id, price_vol) VALUES (?, ?)').run(company_id, zscores[company_id]);
        }
    }
    console.log('PriceVol table prepared');

    // add indices to zscore table
    // create index on price_vol and company_id and also one on company id for joins
    db.prepare('CREATE INDEX IF NOT EXISTS PriceVol_vol ON swsCompanyPriceVol (price_vol ASC, company_id ASC)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS PriceVol_id ON swsCompanyPriceVol (company_id ASC, price_vol ASC)').run();
    console.log('Database Initialisation complete..')
}

export default init;
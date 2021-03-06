export const indices = {
    "Company_id" : {
        "tableName": "swsCompany", 
        "fields": "id ASC, name, unique_symbol"
    },
    "PriceClose_id" : {
        "tableName": "swsCompanyPriceClose", 
        "fields": " company_id ASC, date DESC, price"
    },
    "CompanyScore_score" : {
        "tableName": "swsCompanyScore", 
        "fields": "total ASC, company_id ASC"
    },
    "CompanyScore_id" : {
        "tableName": "swsCompanyScore", 
        "fields": "id ASC, total ASC"
    },
    "PriceVol_vol": {
        "tableName": "swsCompanyPriceVol", 
        "fields": "price_vol ASC, company_id ASC"
    },
    "PriceVol_id" : {
        "tableName": "swsCompanyPriceVol", 
        "fields": "company_id ASC, price_vol ASC"
    }
};

export default indices;
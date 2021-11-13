import AsyncLock from 'async-lock';
import { AccessError }from './error';
import Database from 'better-sqlite3';


const lock = new AsyncLock();

// create generic lock promise 
export const resourceLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire('resourceLock', callback(resolve, reject));
  });

// SQL queries

// Get functions
export const getStocks = (index) =>
  resourceLock((resolve, reject) => {
    resolve({
      ...listings[listingId],
    });
  });
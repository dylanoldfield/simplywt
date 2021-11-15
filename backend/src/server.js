import init from './initDB.js';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import swaggerDocument from '../swagger.json';
import { AccessError, RedisError } from './error.js';
import { getStocks, getStockNum } from './service.js'
//first initialise the DB 
init();

// express instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// error handler function
const catchErrors = (fn) => async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof AccessError) {
        res.status(403).send({ error: err.message });
      } else if (err instanceof RedisError){
        res.status(500).send({ error: err.message });
      } else {
        console.log(err);
        res.status(500).send({ error: 'A system error ocurred' });
      }
    }
  };

/*
  API endpoints
*/
app.get(
  '/stocks/number',
  catchErrors(async (req, res) => {
    return res.json({ number: await getStockNum()});
  }),
);

app.get(
    '/stocks/:index',
    catchErrors(async (req, res) => {
      const { index } = req.params;
      return res.json({ stocks: await getStocks({index : index ? index : 0 , order : 'nothing'}) });
    }),
  );

  app.get(
    '/stocks/:index/sorted/:sortedby',
    catchErrors(async (req, res) => {
      const { index, sortedby} = req.params;
      return res.json({ stocks: await getStocks({index : index ? index : 0 , order : sortedby}) });
    }),
  );


/*
    Running the server
*/

app.get('/', (req, res) => res.redirect('/docs'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const configData = JSON.parse(fs.readFileSync('../frontend/src/config.json'));
const port = 'BACKEND_PORT' in configData ? configData.BACKEND_PORT : 5006;


const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
  console.log(`For API docs, navigate to http://localhost:${port}`);
});

export default server;
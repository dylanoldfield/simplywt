import init from './initDB.js';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
//first initialise the DB 
init();

// express instance
const app = express();
app.use(cors());

// error handler function
const catchErrors = (fn) => async (req, res) => {
    try {
      await fn(req, res);
      save();
    } catch (err) {
      if (err instanceof AccessError) {
        res.status(403).send({ error: err.message });
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
    '/stocks/:index',
    catchErrors(async (req, res) => {
      const { index } = req.params;
      return res.json({ stocks: await getStocks(index) });
    }),
  );

  app.get(
    '/stocks/:index/sorted/:sortedby',
    catchErrors(async (req, res) => {
      const { index, sortedby} = req.params;
      return res.json({ stocks: await getStocksSorted(index , sortedby) });
    }),
  );

/*
    Running the server
*/

app.get('/', (req, res) => res.redirect('/docs'));

const configData = JSON.parse(fs.readFileSync('../frontend/src/config.json'));
const port = 'BACKEND_PORT' in configData ? configData.BACKEND_PORT : 5006;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5005/docs",
      },
    ],
  },
  apis: ["./server.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
  console.log(`For API docs, navigate to http://localhost:${port}`);
});

export default server;
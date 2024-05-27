import fs from 'fs';
import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateTruckCreate, validateTruckUpdate } from './server/trucks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swagger = path.join(__dirname, 'swagger/dist');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/mock.data.json')).toString());

const port = process.env.PORT || 3000;
const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults({
  static: swagger,
});
const { db } = router;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  req.query._page = req.query.page || 1;
  req.query._limit = req.query.limit || 10;
  req.query._sort = req.query.sort || void 0;
  req.query._order = req.query.order || void 0;

  if (req.path.startsWith('/trucks')) {
    if (req.method === 'POST') {
      const errors = validateTruckCreate(req.body || {}, db.get('trucks'));
      if (errors) {
        res.status(400);
        return res.jsonp(errors);
      }
    }

    if (req.method === 'PUT') {
      req.method = 'PATCH';
    }

    if (req.method === 'PATCH') {
      const id = (req.path.match(/\/trucks\/(\w+)/) || [])[1];
      const errors = validateTruckUpdate(id, req.body || {}, db.get('trucks'));
      if (errors) {
        res.status(400);
        return res.jsonp(errors);
      }
    }
  }

  next();
});

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});

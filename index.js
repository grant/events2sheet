const express = require('express');
const {appendToSheet} = require('./sheets');

const handler = async (req, res) => {
  console.log('==START HTTP REQ==');
  const reply = {};

  // Add HTTP headers
  reply.headers = req.headers;
  reply.body = req.body;

  console.log(reply);
  await appendToSheet([
    'NEW EVENT',
    new Date(),
    // reply.headers['ce-specversion'],
    // reply.headers['ce-id'],
    // reply.headers['ce-source'],
    // reply.headers['ce-time'],
    // reply.headers['ce-type'],
    // reply.headers['ce-dataschema'],
    // reply.headers['ce-subject'],
    // reply.body,
    // JSON.stringify(reply),
  ]);
  console.log('==END HTTP REQ==');
  return res.status(200).send(reply);
};

const app = express();
app.use(express.json());
app.get('/', handler);
// app.get('/', (req, res) => {
//   res.send('good');
// });
app.post('/', handler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`STARTING SERVER: ${PORT}`)
);
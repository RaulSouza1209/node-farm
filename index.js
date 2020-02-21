////// CORE MODULES
const http = require('http');
const fs = require('fs');
const url = require('url');

////// OWN MODULES
const replaceTemplate = require('./modules/replaceTemplate');

////// TEMPLATES
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

////// DATA
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);

////// SERVER
const app = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('<h1>Page not found</h1>');
  }
});

////// PORT LISTENING
app.listen(3000, () => {
  console.log('Listening to requests on port 3000');
});

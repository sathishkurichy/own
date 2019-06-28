'use strict';

require('zone.js/dist/zone-node');
require('reflect-metadata');

const express = require('express');

const { enableProdMode } = require('@angular/core');
const { ngExpressEngine } = require('@nguniversal/express-engine');

const { platformServer, renderModuleFactory } = require ('@angular/platform-server');
const { provideModuleMap } = require ('@nguniversal/module-map-ngfactory-loader');
const path = require('path');

enableProdMode();

const domino = require('domino');
const fs = require('fs');
const template = fs.readFileSync(path.join(__dirname, '.', 'dist', 'index.html')).toString();
const win = domino.createWindow(template);

global['window'] = win;
global['document'] = win.document;

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.bundle`);

const app = express();
const PORT = 3001;
const ADDR = '0.0.0.0';
const DIST_FOLDER = path.join(process.cwd(), 'dist');
 
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// server static files
app.use(express.static(DIST_FOLDER, { index: false }));

// ALl regular routes use the Universal engine
app.get('*', (req, res) => {
    console.log(`new GET request at : ${req.originalUrl}`);
    res.render('index', { req, res });
});

// Start up the Node server
app.listen(PORT, ADDR, () => {
  console.log(`Node Express server listening on ${ADDR}:${PORT}`);
});

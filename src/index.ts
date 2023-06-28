import express from 'express';
import compression from 'compression';
import 'dotenv/config';
//import scProxy from '@sitecore-jss/sitecore-jss-proxy';
//import { config } from './config';
const http = require("http");
//import { cacheMiddleware } from './cacheMiddleware';

const app = express();
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// enable gzip compression for appropriate file types
app.use(compression());

// turn off x-powered-by http header
app.settings['x-powered-by'] = false;

// Serve static app assets from local /dist folder
// mixer: TODO
// app.use(
//   '/dist',
//   express.static('dist', {
//     fallthrough: false, // force 404 for unknown assets under /dist
//   })
// );

/**
 * Output caching, can be enabled,
 * Read about restrictions here: {@link https://doc.sitecore.com/xp/en/developers/hd/21/sitecore-headless-development/caching-in-headless-server-side-rendering-mode.html}
 */
//server.use(cacheMiddleware());

app.use((req, _res, next) => {
  // because this is a proxy, all headers are forwarded on to the Sitecore server
  // but, if we SSR we only understand how to decompress gzip and deflate. Some
  // modern browsers would send 'br' (brotli) as well, and if the Sitecore server
  // supported that (maybe via CDN) it would fail SSR as we can't decode the Brotli
  // response. So, we force the accept-encoding header to only include what we can understand.
  if (req.headers['accept-encoding']) {
    req.headers['accept-encoding'] = 'gzip, deflate';
  }

  next();
});

// For any other requests, we render app routes server-side and return them
// mixer: TODO
// app.use('*', scProxy(config.serverBundle.renderView, config, config.serverBundle.parseRouteUrl));

// mixer: TO DELETE
app.get('/', (_req, res) => {
  res.send('Hello World!')
})

const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);


function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log("onListening");
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

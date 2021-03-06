/*eslint no-console: 0*/
(() => {
  'use strict';

  let mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URL);

  let db = mongoose.connection;

  db.on('error', console.error.bind(console, 'Connection Error : '));
  db.once('open', () => {
    console.log('Connection ok!');
  });

  module.exports = mongoose;

})();

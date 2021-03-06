const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.DB_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to mongo');
});

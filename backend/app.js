const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const companyRoutes = require('./routes/companies');
const labelTypeRoutes = require('./routes/label-types');

const app = express();

mongoose.connect(`mongodb+srv://allen:${process.env.MONGO_ATLAS_PW}@cluster0-jbaw4.mongodb.net/emlg?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(() => {
    console.log('Connection to database FAILED');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/companies', companyRoutes);
app.use('/api/label-types', labelTypeRoutes);

module.exports = app;

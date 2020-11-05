"use strict";

var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
var emailSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: false
  }
});
var Model = mongoose.model('Model', emailSchema);
module.exports = Model;
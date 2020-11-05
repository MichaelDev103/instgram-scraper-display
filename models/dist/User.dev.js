"use strict";

var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: function transform(doc, ret) {
      //delete ret._id;
      delete ret.password;
      return ret;
    }
  },
  timestamps: true
});
userSchema.plugin(require('mongoose-hidden'));
var User = mongoose.model('User', userSchema);
module.exports = User;
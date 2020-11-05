const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

const emailSchema = new mongoose.Schema({
	email: {
		type: String,
		require: true,
		unique: false,
	},
});

const Model = mongoose.model('Model', emailSchema);

module.exports = Model;

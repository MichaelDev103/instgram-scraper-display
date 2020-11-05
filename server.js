const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app.js');

dotenv.config({
	path: './config.env',
});

mongoose
	.connect(
		'mongodb+srv://admin:admin@cluster0.ljnid.mongodb.net/<dbname>?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
		}
	)
	.then(() => {
		console.log('DB connection successful!');
	});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

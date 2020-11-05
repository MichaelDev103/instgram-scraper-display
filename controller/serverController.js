const Model = require('./../models/Model');
const User = require('./../models/User');

var quickemailverification = require('quickemailverification')
    .client('d4a7296ad341c31b0a4a0716ada7d9bbb48f041763f583862fc68ece68db')
    .quickemailverification();
const fs = require('fs');
const request = require('request-promise');

var multer = require('multer');
const storage = multer.diskStorage({
    destination: './view/assets/uploads',
    filename: function(req, file, cb) {
        cb(null, 'result-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
}).single('file');
//

//BULK_VERIFICATION
var resultOutput = [];

exports.postBulk = async(req, res) => {
    try {
        await upload(req, res, (error) => {
            if (error) {
                if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
                    var indexView = fs.readFileSync(`${__dirname}/../view/isUnknown.html`, 'utf-8');

                    indexView = indexView.replace(/-- \w.* --/g, '-- ' + 'SERVER ERROR' + ' --');
                    fs.writeFileSync(`${__dirname}/../view/isUnknown.html`, indexView);

                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    });

                    res.end(indexView);
                } else {
                    throw new Error(error);
                }
            } else {
                var filename = req.file.filename;
                console.log(req.file.filename);

                fs.readFile(`./view/assets/uploads/${filename}`, 'utf8', function(err, data) {
                    data.split('\r\n').forEach(checkemail);

                    setTimeout(function() {
                        var indexView = fs.readFileSync(`${__dirname}/../view/isValidCSV.html`, 'utf-8');

                        //add result to excel
                        const writeStream = fs.createWriteStream(`./view/assets/uploads/${filename}`);

                        resultOutput.forEach(function(element) {
                            writeStream.write(`${element}\n`);
                        });

                        indexView = indexView.replace(
                            /-- \w.* --/g,
                            ' -- ' +
                            `<a href="assets/uploads/${filename}" download><hr> DOWNLOAD RESULT FILE </a>` +
                            ' -- '
                        );

                        fs.writeFileSync(`${__dirname}/../view/isValidCSV.html`, indexView);

                        res.writeHead(200, {
                            'Content-Type': 'text/html',
                        });

                        res.end(indexView);

                        console.log(resultOutput);

                        var replacedView = fs.readFileSync(
                            `${__dirname}/../view/isValidCSVreplaced.html`,
                            'utf-8'
                        );
                        fs.writeFileSync(`${__dirname}/../view/isValidCSV.html`, replacedView);

                        resultOutput = [];
                    }, 16500);
                });
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
            attention: 'Cannot verify the CSV file. Call support!',
        });
    }
};

var checkemail = async function(param) {
    const vars = {
        method: 'POST',
        url: 'https://ssfy.sh/amaurymartiny/reacher@eb5494d3/check_email',
        headers: {
            'content-type': 'application/json',
            authorization: '49d391f21d497dd643275185',
        },
        body: {
            to_email: param,
        },
        json: true,
        timeout: 15500,
    };

    const boolean = await request(vars, (error, res, body) => {
        if (error) {
            console.error(error);
            // throw new Error(error);
        }
        resultOutput.push([body.input, body.is_reachable]);
    });
    //console.log(boolean);
};

//SINGLE_VERIFICATION (FROM INPUT)
let condition = '';
exports.postModel = async(req, res) => {
    try {
        //const email = await Model.create(req.body);

        emailCheck = req.body.email;
        console.log(emailCheck);

        const options = {
            method: 'POST',
            url: 'https://ssfy.sh/amaurymartiny/reacher@eb5494d3/check_email',
            headers: {
                'content-type': 'application/json',
                authorization: '49d391f21d497dd643275185',
            },
            body: {
                // to_email: emailCheck,
                to_emails: ["candera333e@gmail.com", "Rainbow006E@yandex.com"],
            },
            json: true,
            timeout: 15500,
        };

        const boolean = await request(options, (error, response, body) => {
            if (error) {
                if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
                    var indexView = fs.readFileSync(`${__dirname}/../view/isUnknown.html`, 'utf-8');

                    indexView = indexView.replace(/-- \w.* --/g, '-- ' + emailCheck + ' --');
                    fs.writeFileSync(`${__dirname}/../view/isUnknown.html`, indexView);

                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    });

                    res.end(indexView);
                } else {
                    throw new Error(error);
                }
            }
        });

        console.log('email response: ', boolean);

        if (boolean.is_reachable === 'safe') {
            var indexView = fs.readFileSync(`${__dirname}/../view/isValid.html`, 'utf-8');

            //var booleanString = JSON.stringify(boolean, undefined, 2);

            indexView = indexView.replace(/-- \w.* --/g, '-- ' + emailCheck + ' --');
            fs.writeFileSync(`${__dirname}/../view/isValid.html`, indexView);

            console.log(boolean);

            res.writeHead(200, {
                'Content-Type': 'text/html',
            });

            res.end(indexView);
        } else if (boolean.is_reachable === 'invalid') {
            var indexView = fs.readFileSync(`${__dirname}/../view/isNotValid.html`, 'utf-8');

            indexView = indexView.replace(/-- \w.* --/g, '-- ' + emailCheck + ' --');
            fs.writeFileSync(`${__dirname}/../view/isNotValid.html`, indexView);

            console.log(boolean);

            res.writeHead(200, {
                'Content-Type': 'text/html',
            });
            res.end(indexView);
        } else if (boolean.is_reachable === 'risky') {
            var indexView = fs.readFileSync(`${__dirname}/../view/isRisky.html`, 'utf-8');

            indexView = indexView.replace(/-- \w.* --/g, '-- ' + emailCheck + ' --');
            fs.writeFileSync(`${__dirname}/../view/isRisky.html`, indexView);

            console.log(boolean);

            res.writeHead(200, {
                'Content-Type': 'text/html',
            });
            res.end(indexView);
        } else {
            await quickemailverification.verify(emailCheck, function(err, response) {
                condition = response.body.result;

                console.log('unknown');

                if (condition === 'valid') {
                    var indexView = fs.readFileSync(`${__dirname}/../view/isValid.html`, 'utf-8');

                    indexView = indexView.replace(/-- \w.* --/g, '-- ' + emailCheck + ' --');
                    fs.writeFileSync(`${__dirname}/../view/isValid.html`, indexView);

                    console.log(response.body);

                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    });

                    res.end(indexView);
                } else if (condition === 'invalid') {
                    var indexView = fs.readFileSync(`${__dirname}/../view/isNotValid.html`, 'utf-8');

                    console.log(response.body);

                    indexView = indexView.replace(/-- \w.* --/g, '-- ' + emailCheck + ' --');
                    fs.writeFileSync(`${__dirname}/../view/isNotValid.html`, indexView);

                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    });
                    res.end(indexView);
                }
            });
        }
    } catch (err) {
        var indexView = fs.readFileSync(`${__dirname}/../view/isUnknown.html`, 'utf-8');

        indexView = indexView.replace(/-- \w.* --/g, '-- ' + emailCheck + ' --');
        fs.writeFileSync(`${__dirname}/../view/isUnknown.html`, indexView);

        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        res.end(indexView);

        res.status(404).json({
            status: 'fail',
            message: err.message,
            attention: 'Cannot verify more emails. Call support!',
        });
    }
};
/////////end_api_post

exports.getAllModels = async(req, res) => {
    try {
        const model = await Model.find();

        res.status(200).json({
            models: model,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.deleteAllModels = async(req, res) => {
    try {
        const model = await Model.deleteMany();

        res.status(200).json({
            status: 'deleted!',
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
};

//Users

exports.getAllUsers = async(req, res) => {
    try {
        const user = await User.find();

        res.status(200).json({
            users: user,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.createUser = async(req, res) => {
    try {
        const user = await User.create(req.body);

        const indexView = fs.readFileSync(`${__dirname}/../view/accountCreated.html`, 'utf-8');

        res.writeHead(200, {
            'Content-Type': 'text/html',
        });

        res.end(indexView);
    } catch (err) {
        const indexView = fs.readFileSync(`${__dirname}/../view/accountNotCreated.html`, 'utf-8');

        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        res.end(indexView);
    }
};

exports.login = async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username, password: req.body.password });

        if (user) {
            const indexView = fs.readFileSync(`${__dirname}/../view/loggedIn.html`, 'utf-8');

            res.writeHead(200, {
                'Content-Type': 'text/html',
            });

            res.end(indexView);
        } else if (!user) {
            const indexView = fs.readFileSync(`${__dirname}/../view/notloggedIn.html`, 'utf-8');

            res.writeHead(200, {
                'Content-Type': 'text/html',
            });

            res.end(indexView);
        }
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.deleteAllUsers = async(req, res) => {
    try {
        const user = await User.deleteMany();

        res.status(200).json({
            status: 'deleted!',
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
};
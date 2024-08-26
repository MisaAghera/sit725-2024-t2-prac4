let express = require('express');
let server = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb://localhost:27017";
const dbUri = "mongodb+srv://s223000802:aIKUfpEXiAptMNMr@cluster0.janjm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//const dbUri = "mongodb+srv://s223000802:aIKUfpEXiAptMNMr@cluster0.janjm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
let serverPort = process.env.port || 3000;
let catCollection;

server.use(express.static(__dirname + '/public'))
server.use(express.json());
server.use(express.urlencoded({extended: false}));

const dbClient = new MongoClient(dbUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDB() {
    try {
        await dbClient.connect();
        catCollection = dbClient.db().collection('Cat');
        console.log(catCollection);
    } catch(error) {
        console.error(error);
    }
}

server.get('/', function (req, res) {
    res.render('indexMongo.html');
});

server.get('/api/cats', (req, res) => {
    fetchAllCats((err, result) => {
        if (!err) {
            res.json({statusCode: 200, data: result, message: 'get all cats successful'});
        }
    });
});

server.post('/api/cat', (req, res) => {
    let newCat = req.body;
    addCat(newCat, (err, result) => {
        if (!err) {
            res.json({statusCode: 201, data: result, message: 'success'});
        }
    });
});

function addCat(cat, callback) {
    catCollection.insertOne(cat, callback);
}

function fetchAllCats(callback) {
    catCollection.find({}).toArray(callback);
}

server.listen(serverPort, () => {
    console.log('express server started');
    connectToDB();
});
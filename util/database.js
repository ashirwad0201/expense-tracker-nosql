const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;

let _db;
const mongoConnect=callback=>{
    MongoClient
    .connect(
      "mongodb+srv://Ashi0201:02011999@cluster0.vk1wtvm.mongodb.net/expense?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(client=> {
      console.log("Connected!");
      _db=client.db();
      callback();
    })
    .catch(err => {
      console.log(err)
      throw err;
    });
}


const getDb=()=>{
    if(_db){
        return _db;
    }
    throw 'No Database Found';
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
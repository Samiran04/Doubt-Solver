const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/Codeial_development',{useNewUrlParser: true, useUnifiedTopology: true});
const db=mongoose.connection;
db.on('error',console.error.bind(console,'Error Connection in MongoDB'));
db.once('open',function(){
    console.log('MongoDB is connected to Mongoose');
});
module.exports=db;
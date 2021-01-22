const express=require('express');
const app=express();
const port=8000;
const layout=require('express-ejs-layouts');

const db=require('./config/mongoose');

app.use(express.static('./assets'));
app.use(layout);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.use('/',require('./routes'));
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err)
    {
        console.log(`Error:${err}`);
        return;
    }
    console.log(`Sever runs on port:${port}`);
});
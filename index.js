const express=require('express');
const app=express();
const port=8000;
const layout=require('express-ejs-layouts');

app.use(layout);

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
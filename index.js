const express=require('express');
const app=express();
const port=8000;

app.listen(port,function(err){
    if(err)
    {
        console.log(`Error:${err}`);
        return;
    }
    console.log(`Sever runs on port:${port}`);
});
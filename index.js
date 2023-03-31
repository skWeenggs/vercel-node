import  express  from "express";

const app=express();

const port =9000;

app.use('/',(req,res)=>{
    res.json({massage:"hiiii"})
})
app.use('/call',(req,res)=>{
    res.json({massage:"call massage"})
})

app.listen(900,()=>{
    console.log(`starting server on ${port}`);
})

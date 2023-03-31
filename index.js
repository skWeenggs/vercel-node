const express =require('express');
const cors =require('cors');
const {Client}=require('@notionhq/client')
const dotenv=require('dotenv');
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json())
const port=5000;

const notion= new Client({ auth:process.env.NOTION_KEY});


app.get('/fetchpage1/:id', async(req,res)=>{
    try{
        console.log("id",req.params.id);
        const users=await notion.databases.retrieve({
            database_id:req.params.id

        });
        res.status(200).json({users})
        console.log(users);
        // return users.json();
    }catch(err){
        console.log(err);
    }
})


app.get('/fetchuserdata/:id', async(req,res)=>{
    try{
        console.log("id",req.params);
        const users=await notion.databases.query({
            database_id:req.params.id

        });
        res.status(200).json({users})
        console.log(users);
        // return users.json();
    }catch(err){
        console.log(err);
    }
})
// const Host='localhost';
app.use('/a',(req,res)=>{
    res.json({massage:"hiiii"})
})
app.use('/call',(req,res)=>{
    res.json({massage:"call massage"})
})

app.listen(port,()=>{
    console.log(`starting server on ${port}`);
})

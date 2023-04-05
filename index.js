const express =require('express');
const cors =require('cors');
const {Client}=require('@notionhq/client')
const dotenv=require('dotenv');
const jwt=require('jsonwebtoken');

const jwtKey="example"
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json())
const port=5000;

const notion= new Client({ auth:process.env.NOTION_KEY});


function varifyToken(req,res,next){
    let token=req.headers['authorization'];
    if(token){
        token=token.split(" ")[1];
        console.log(token);
        jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){

                res.status(401).send({result:"Please add valid token "})
            }
            else{
                next();
            }
        })
    }else{
            res.status(403).send({result:"Please add token with header"})
    }
}



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

app.get('/fetchuserdatafilter/:id', async(req,res)=>{
    try{
        console.log("id",req.params);
        console.log("query",req.query);
        const users=await notion.databases.query({
            database_id:req.params.id,
            filter: {
                property: "Tags", // Replace "Tags" with the name of your multi-select property
                multi_select: {
                  "contains": req.query.q, // Replace "Urgent" with the name of the tag you want to filter on
                },
              },
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
app.get('/fetchuserquery/:id', async(req,res)=>{
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

app.post('/loginuser', async(req,res)=>{
    try{
        console.log(req.body.email);
        if (req.body.email) {

            const listUsersResponse = await notion.users.list()
            console.log(listUsersResponse)


            if(listUsersResponse.results[0].person.email!==req.body.email){
                return res.status(403).send({
                    msg:"Invalid user"
                })
            }
            jwt.sign({listUsersResponse},jwtKey,{expiresIn:"9h"},(err,token)=>{
                if(err){
                    res.send({result:"something went wrong,please try after sometime"})
                }
                res.send({listUsersResponse, auth:token})
            })
         }else{
        return res.status(404).send({ result: "No User found" })
    }
    }catch(err){
        console.log(err);
    }
})

app.post('/loginadmin', async(req,res)=>{
    try{
        console.log(req.body.email,req.body.password);
        if (req.body.email && req.body.password=== "admin@123") {

            const listUsersResponse = await notion.users.list()
            console.log(listUsersResponse)


            if(listUsersResponse.results[0].person.email!==req.body.email){
                return res.status(403).send({
                    msg:"Invalid user"
                })
            }
            jwt.sign({listUsersResponse},jwtKey,{expiresIn:"9h"},(err,token)=>{
                if(err){
                    res.send({result:"something went wrong,please try after sometime"})
                }
                res.send({listUsersResponse, auth:token})
            })
         }else{
        return res.status(404).send({ result: "No User found" })
    }
    }catch(err){
        console.log(err);
    }
})


app.delete('/deleterecord/:id',varifyToken, async(req,res)=>{
    try
    {
        console.log("data",req.params.id);

        const users=await notion.blocks.delete({
            block_id:req.params.id,
        });
        console.log(users);
        res.status(200).json({users})
        
    }catch(err){
        console.log(err);
        res.status(500).json({err})
    }
})


app.use('/call',(req,res)=>{
    res.json({massage:"call massage"})
})

app.listen(port,()=>{
    console.log(`starting server on ${port}`);
})

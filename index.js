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
app.post('/login', async(req,res)=>{
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


app.use('/call',(req,res)=>{
    res.json({massage:"call massage"})
})

app.listen(port,()=>{
    console.log(`starting server on ${port}`);
})

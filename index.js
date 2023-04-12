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

let token;

const domainTokenMap = [
    { domain: 'localhost', token: "secret_u9EJwvbbcnnjJ3DN2aXJsDA2YgfEk6lBxsyCWdK539O" },
    { domain: 'domain123.netlify.app', token: "secret_jZwhw0TF233lAXipH5V1hIdOkt4tODKvDBJKG5pWHnW" },
    { domain: 'domain12345.netlify.app', token: "secret_jZwhw0TF233lAXipH5V1hIdOkt4tODKvDBJKG5pWHnW" },
    { domain: 'domain121.netlify.app', token: "secret_u9EJwvbbcnnjJ3DN2aXJsDA2YgfEk6lBxsyCWdK539O" },
    { domain: 'domain122.netlify.app', token: "secret_kb3A0fpt6vnABfDop4p16Zjv3g3ibAhMvrOuw7cH9pG" },
    // add more domain-token mappings as needed
  ];
// const notion= new Client({ auth:process.env.NOTION_KEY});


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

app.get('/fetchuserdatafilter/:id/:domain', async(req,res)=>{
    try{
        const mapping = domainTokenMap.find(mapping => mapping.domain === req.params.domain);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.domain}`);
        }
        const token = mapping.token;
        const notion = new Client({ auth: token });

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

app.get('/fetchuserdata/:id/:domain', async(req,res)=>{
    try{
        const mapping = domainTokenMap.find(mapping => mapping.domain === req.params.domain);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.domain}`);
        }
        const token = mapping.token;
        const notion = new Client({ auth: token });
  
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

app.get('/fetchuserfeature/:id/:domain', async(req,res)=>{
    try{
        const mapping = domainTokenMap.find(mapping => mapping.domain === req.params.domain);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.domain}`);
        }
        const token = mapping.token;
        const notion = new Client({ auth: token });
  
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
        const notion= new Client({ auth:process.env.NOTION_KEY});
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
        const notion= new Client({ auth:process.env.NOTION_KEY});
        console.log(req.body.email,req.body.password);
        if (req.body.email && req.body.password === "admin@123") {

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

app.post('/submitFormToNotion', async(req,res)=>{
  
    const email = req.body.email;
    const domain_name = req.body.domain;
    const contentPageId = req.body.content_page_id;
    const pagesPageId = req.body.pages_page_id;
    const token_secretid = req.body.token_secretid;
    const template= req.body.temp;
    
    try{
       const response=await notion.pages.create({
           parent:{database_id: process.env.NOTION_DATABASE_ID },
           properties:{
            Name: {
                title: [
                  {
                    text: {
                      "content": "Master Page"
                    }
                  }
                ]
              },
            Email:{
                type:'email',
                email:email
            }, 
            Domain:{
                rich_text:[{
                    text:{
                        content: domain_name
                    }
                }
                ]
            } ,
            ContentPageId:{
                rich_text:[{
                    text:{
                        content:contentPageId
                    }
                }
                ]
            } ,
          
            PagesPageId:{
                rich_text:[{
                    text:{
                        content: pagesPageId
                    }
                }
                ]
            },
            NotionToken:{
                rich_text:[
                    {
                        text:{
                            content: token_secretid
                        }
                    }
                ]
            },
            Template:{
                rich_text:[
                    {
                        text:{
                            content: template
                        }
                    }
                ]
            }
           }
       })
    
       res.send(response);
   }catch(err){
        res.send(err);
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

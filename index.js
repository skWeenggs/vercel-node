// const express =require('express');
// const cors =require('cors');
// const {Client}=require('@notionhq/client')
// const dotenv=require('dotenv');
// const jwt=require('jsonwebtoken');
// const axios = require("axios");

import express from 'express';
import cors from 'cors'
import  {Client}  from '@notionhq/client';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import axios from 'axios';
import  {NotionAPI}  from 'notion-client';


const userQuery =[]
const jwtKey="example"
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json())
const port=5000;
var AdminList=[];

let token;
// const notionread = new NotionAPI()

// const notion= new Client({ auth:process.env.NOTION_KEY});
const domainTokenMap = [
    { domain: 'localhost', token: "secret_jCPvAqiz18oGS3wWeex26mpXAW4SGrrRtlmZ2mDMB07" },
    { domain: 'chatg.in', token: "secret_jCPvAqiz18oGS3wWeex26mpXAW4SGrrRtlmZ2mDMB07" },
    { domain: 'domain121.netlify.app', token: "secret_jCPvAqiz18oGS3wWeex26mpXAW4SGrrRtlmZ2mDMB07" },
    { domain: 'domain123.netlify.app', token: "secret_jZwhw0TF233lAXipH5V1hIdOkt4tODKvDBJKG5pWHnW" },
    { domain: 'domain12345.netlify.app', token: "secret_jZwhw0TF233lAXipH5V1hIdOkt4tODKvDBJKG5pWHnW" },
    // { domain: 'blog.gosetu.com', token: "secret_u9EJwvbbcnnjJ3DN2aXJsDA2YgfEk6lBxsyCWdK539O" },
    { domain: 'blog.gosetu.com', token: "secret_14k7F8RLzdHbJC0FsmjlJjeehBxwnfTgTtBthQjBeEf" },
    { domain: 'domain122.netlify.app', token: "secret_kb3A0fpt6vnABfDop4p16Zjv3g3ibAhMvrOuw7cH9pG" },
    { domain: 'jehotiw648.netlify.app', token: "secret_FQR32agEjWFSZi1zTLpbKZloKLPG0Kg0dHiADM3ln1k" },
    // add more domain-token mappings as needed
  ];
// const notion= new Client({ auth:process.env.NOTION_KEY});


////fetch admin side data
async function fetchAdminData() {
    try {
      const notion = new Client({ auth: process.env.NOTION_KEY });
      const userList = await notion.databases.query({ database_id: process.env.NOTION_DATABASE_ID });
      return userList?.results?.map((list, ind) => ({
        id:list.id,
        email: list.properties.Email.email,
        domainName: list.properties.Domain?.rich_text[0]?.plain_text,
        templateName: list.properties.Template?.rich_text[0]?.plain_text,
        contentPageId: list.properties.ContentPageId?.rich_text[0]?.plain_text,
        pagesPageId: list.properties.PagesPageId?.rich_text[0]?.plain_text,
        authorPageId: list.properties.AuthorPageId?.rich_text[0]?.plain_text,
        tagPageId: list.properties.TagPageId?.rich_text[0]?.plain_text,
        notionToken:list.properties.NotionToken?.rich_text[0]?.plain_text,
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  fetchAdminData()
  .then((userQuery) => {
    AdminList = userQuery;
    // console.log('User Query:', AdminList);
  })
  .catch((error) => {
    console.log('Error:', error);
  });

  app.delete('/deleteTemplateRecord/:id/:email',async(req,res)=>{
    try{
      fetchAdminData()
      const mapping = AdminList && AdminList.find(mapping => mapping.email === req.params.email);
      if (!mapping) {
        throw new Error(`No matching domain found for ${req.params.email}`);
      }
      // const token=mapping.notionToken;
      const notion = new Client({ auth: process.env.NOTION_KEY });
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

app.delete('/deleteUserRecord/:id/:email',async(req,res)=>{
  try{
    fetchAdminData()
    const mapping = AdminList && AdminList.find(mapping => mapping.email === req.params.email);
    if (!mapping) {
      throw new Error(`No matching domain found for ${req.params.email}`);
    }
    const token=mapping.notionToken;
    const notion = new Client({ auth: token });
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
  app.post('/AdminContentSave/:id/:email',async(req,res)=>{
    const content=req.body.content;
    const slug=req.body.slug;
    // const ready=req.body.ready;
    const date=req.body.date ;
    const feature=req.body.feature;
    const excerpt=req.body.excerpt;
    try{
 
        const mapping = AdminList && AdminList.find(mapping => mapping.email === req.params.email);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.email}`);
        }
        console.log("mapp------",mapping,req.params.id);
        const token = mapping.notionToken;
        const notion = new Client({ auth: token });
        const response= await notion.pages.create({
          parent:{database_id:req.params.id},
          properties:{
            Name:{
              title:[
                {
                  text:{
                    content: content
                  }
                }
              ]
            },
            Slug:{
              rich_text:[{
                text:{
                  content:slug
                }
              }]
            },
          
            PublishDate: {
              "type": "date",
              "date": {
                start: date
              }
            },
            Featured: {
              "type": "checkbox",
              checkbox: feature
            },
            Excerpt:{
              rich_text:[
                {
                  text:{
                    content:excerpt
                  }
                }
              ]
            }
          }
        })
        res.send(response)
      }
    catch(err){
      console.log(err);
    }
  })
  app.post('/Insert/:id/:email',async(req,res)=>{
    const pagename=req.body.pagename;
    const slug=req.body.slug;
     const date=req.body.date ;
     try{
 
        const mapping = AdminList && AdminList.find(mapping => mapping.email === req.params.email);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.email}`);
        }
        console.log("mapp------",mapping,req.params.id);
        const token = mapping.notionToken;
        const notion = new Client({ auth: token });
        const response= await notion.pages.create({
          parent:{database_id:req.params.id},
          properties:{
            Name:{
              title:[
                {
                  text:{
                    content: pagename
                  }
                }
              ]
            },
            Slug:{
              rich_text:[{
                text:{
                  content:slug
                }
              }]
            },
          
            PublishDate: {
              "type": "date",
              "date": {
                start: date
              }
            },
          
          }
        })
        res.send(response)
      }
    catch(err){
      console.log(err);
    }
  })

  app.patch('/Update/:id/:email',async(req,res)=>{
    const pagename=req.body.pagename;
    const slug=req.body.slug;
     const newdate=req.body.publishDate;
     try{
 
        const mapping = AdminList && AdminList.find(mapping => mapping.email === req.params.email);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.email}`);
        }
        console.log("mapp------",mapping,req.params.id,newdate);
        const token = mapping.notionToken;
        const notion = new Client({ auth: token });
        const response= await notion.pages.update({
          page_id:req.params.id,
          properties:{
            Name:{
              title:[
                {
                  text:{
                    content: pagename
                  }
                }
              ]
            },
            Slug:{
              rich_text:[{
                text:{
                  content:slug
                }
              }]
            },
            PublishDate: {
              type: "date",
              date: {
                start : newdate
              }
            }
          }
        })
        res.send(response)
      }
    catch(err){
      console.log(err);
    }
  })


  app.get('/AdminPages/:id/:email', async (req, res) => {
    try {
        fetchAdminData()
        const mapping = AdminList && AdminList.find(mapping => mapping.email === req.params.email);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.email}`);
        }
        // console.log("mapp------",mapping);
        const token = mapping.notionToken;
        const notion = new Client({ auth: token });
      // Fetch pages from the Notion API
      const result = await notion.databases.query({
        database_id: req.params.id, // Replace with the ID of your Notion database
      })
       res.status(200).json({result})
    
    } catch (error) {
      console.error('Error fetching data from Notion:', error);
      res.status(500).json({ error: 'An error occurred while fetching data from Notion' });
    }
  });


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



// app.get('/fetchpage1/:id', async(req,res)=>{
 
//     try{
//         console.log("id",req.params.id);
       
//         const users=await notion.databases.retrieve(
//             {
//             database_id:req.params.id

//         }
//         );
//         res.status(200).json({users})
//         console.log(users);
//         return users.json();
//     }catch(err){
//         console.log(err);
//     }
// })

app.get('/fetchpagelogo/:id/:domain', async(req,res)=>{
 
    try{
        console.log("id",req.params.id,req.params.domain);
        const mapping = domainTokenMap.find(mapping => mapping.domain === req.params.domain);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.domain}`);
        }
        const token = mapping.token;
        const notion = new Client({ auth: token });
       
        const users=await notion.databases.retrieve(
            {
            database_id:req.params.id

        }
        );
        res.status(200).json({users})
        console.log(users);
        return users.json();
    }catch(err){
        console.log(err);
    }
})

// app.get('/fetchuserdatafilter/:id/:domain', async(req,res)=>{
//     try{
//         const mapping = domainTokenMap.find(mapping => mapping.domain === req.params.domain);
//         if (!mapping) {
//           throw new Error(`No matching domain found for ${req.params.domain}`);
//         }
//         const token = mapping.token;
//         const notion = new Client({ auth: token });

//         const users=await notion.databases.query({
//             database_id:req.params.id,
//             filter: {
//                 property: "Tags", // Replace "Tags" with the name of your multi-select property
//                 multi_select: {
//                   "contains": req.query.q, // Replace "Urgent" with the name of the tag you want to filter on
//                 },
//               },
//         });
//         res.status(200).json({users})
//         console.log(users);
//         // return users.json();
//     }catch(err){
//         console.log(err);
//     }
// })

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
            property: "Tags", 
            relation: {
                contains: req.query.q, 
            },
        }});
        res.status(200).json({users})
        console.log(users);
        // return users.json();
    }catch(err){
        console.log(err);
    }
})



app.get('/fetchdata/:id', async (req, res) => {
    try{
 
        const notion = new NotionAPI()

        const recordMap = await notion.getPage(req.params.id)

        res.status(200).json({recordMap})
   
    }catch(err){
        console.log(err);
    }
  });






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
        return res.status(404).send({ result: "No Data found" })
        
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

app.get('/fetchuserquery', async(req,res)=>{
    try{
        const notion= new Client({ auth:process.env.NOTION_KEY});
        console.log("id",req.params);
        const users=await notion.databases.query({
            database_id : process.env.NOTION_DATABASE_ID

        });
        res.status(200).json({users})
        console.log(users);
        // return users.json();
    }catch(err){
        console.log(err);
    }
})

// app.get('/fetchNotionApi/:id', async(req,res)=>{
//     try{
//         const notion= new Client({ auth:process.env.NOTION_KEY});
//         console.log("id",req.params);
//         const users=await notion.databases.query({
//             database_id : req.params.id

//         });
//         res.status(200).json({users})
//         console.log(users);
//         // return users.json();
//     }catch(err){
//         console.log(err);
//     }
// })

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
    const notion= new Client({ auth:process.env.NOTION_KEY});
    const email = req.body.email;
    const domain_name = req.body.domain;
    const contentPageId = req.body.content_page_id;
    const pagesPageId = req.body.pages_page_id;
    const tagPageId = req.body.tag_page_id;
    const authorPageId = req.body.author_page_id;
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
            TagPageId:{
                rich_text:[{
                    text:{
                        content: tagPageId
                    }
                }
                ]
            },
            AuthorPageId:{
                rich_text:[{
                    text:{
                        content: authorPageId
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

app.patch('/updatedomain/:id',async(req,res)=>{
  const notion= new Client({ auth:process.env.NOTION_KEY});
  const domain_name = req?.body?.domain;
  try{
    const response=await notion.pages.update({
      page_id:req.params.id,
      properties:{
        Domain:{
          rich_text:[{
              text:{
                  content: domain_name
              }
          }
          ]
      }
      }
    })
    res.status(200).json({response})
    // res.send(response)
  }catch(err){
    res.send(err)
  }
})

app.patch('/updateuser/:id', async(req,res)=>{

    // console.log(req.params.id,req.body.domain);
    const notion= new Client({ auth:process.env.NOTION_KEY});
    const email = req?.body?.email;
    const domain_name = req?.body?.domain;
    const contentPageId = req?.body?.contentPageId;
    const pagesPageId = req?.body?.pagesPageId;
    const authorPageId = req?.body?.authorPageId;
    const token_secretid = req?.body?.notionToken;
    const template= req?.body?.temp;
    console.log(email,domain_name,contentPageId,pagesPageId,token_secretid,template);
    const pageId=req.params.id;
    try{
       const response=await notion.pages.update({
           page_id:req.params.id,
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
            AuthorPageId:{
                rich_text:[{
                    text:{
                        content: authorPageId
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
        const notion= new Client({ auth:process.env.NOTION_KEY});
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

app.get('/users', async (req, res) => {
    try {
      const response = await axios.post(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Notion-Version': '2021-08-16',
          'Authorization': `Bearer ${process.env.NOTION_KEY}`
        }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  app.get('/usersdata/:domain', async (req, res) => {
    try {
      const notionQuery= async ()=>{
      const response = await axios.post(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Notion-Version': '2021-08-16',
          'Authorization': `Bearer ${process.env.NOTION_KEY}`
        }
      });
      return response.data;
    }
      const usersData = await notionQuery();
 
      const domainMap = usersData.results.filter(page => {
        const url = page.properties.Domain?.rich_text[0]?.plain_text;
        return url === req.params.domain;
      });
      
      const notion = new Client({ auth: process.env.NOTION_KEY });
      
      if (domainMap.length > 0) {
        const footerPageIds = domainMap[0]?.properties?.FooterId?.relation.map(relation => relation.id);
        const footerNewsIds = domainMap[0]?.properties?.FooterNewsId?.relation.map(relation => relation.id);
        const navlinkid=domainMap[0]?.properties?.NavigationId?.relation.map(relation => relation.id);
        
        if ((!footerPageIds || footerPageIds.length === 0) && (!footerNewsIds || footerNewsIds.length === 0) && (!navlinkid)) {
          throw new Error("Missing footer IDs and newsletter ID.");
        } else {
          const footerDataPromises = footerPageIds ? footerPageIds.map(id => notion.pages.retrieve({ page_id: id })) : [];
          const footerNewsDataPromises = footerNewsIds ? footerNewsIds.map(id => notion.pages.retrieve({ page_id: id })) : [];
          const navigationDataPromises = navlinkid ? navlinkid.map(id => notion.pages.retrieve({ page_id: id })) : [];
      
          const [footerDataResponses, footerNewsDataResponses,navigationDataResponse] = await Promise.all([
            Promise.all(footerDataPromises),
            Promise.all(footerNewsDataPromises),
            Promise.all(navigationDataPromises) 
          ]);
       
          res.json({ usersData,footerDataResponses,footerNewsDataResponses,navigationDataResponse });
        }
      } else {
        res.json({ usersData, footerDataResponses: [], footerNewsDataResponses: [],navigationDataResponse:[] });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  // app.get('/usersdata/:domain', async (req, res) => {
  //   try {
  //     const notionQuery= async ()=>{
  //     const response = await axios.post(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {}, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Notion-Version': '2021-08-16',
  //         'Authorization': `Bearer ${process.env.NOTION_KEY}`
  //       }
  //     });
  //     return response.data;
  //   }
  //     const usersData = await notionQuery();
 
  //     const domainMap = usersData.results.filter(page => {
  //       // console.log(page);
  //       // const temp = page.properties.Template?.rich_text[0]?.plain_text;     
  //       // return temp === req.params.domain
  //       // const email = page.properties.Email.email
  //       // return email === req.params.domain
  //       const url = page.properties.Domain?.rich_text[0]?.plain_text;
  //       return url === req.params.domain
  //     })
  //     const notion = new Client({ auth: process.env.NOTION_KEY });
  //     console.log("domainmap",domainMap[0]?.properties?.FooterId);
  //     if (domainMap.length > 0) {
  
  //       const footerPageId = domainMap[0]?.properties?.FooterId?.relation[0]?.id;
  //       const footerNewsId= domainMap[0]?.properties?.FooterNewsId?.relation[0]?.id;

  //       if (!footerPageId && !footerNewsId) {
  //         throw new Error("Missing footer IDs and newLatterId");
  //       }else if(!footerPageId){
  //         const footerNewsResponse=await notion.pages.retrieve({page_id:footerNewsId})
  //         const footerNewsData = footerNewsResponse;
  //         res.json({usersData,footerData:{},footerNewsData})
          
  //       }else{
  //       const footerResponse=await notion.pages.retrieve({page_id:footerPageId})
  //       const footerData = footerResponse;

  //       const footerNewsResponse=await notion.pages.retrieve({page_id:footerNewsId})
  //       const footerNewsData = footerNewsResponse;

  //       res.json({usersData,footerData,footerNewsData})
  //       }
  //     }
  //     else {
  //       res.json({ usersData, footerData: {}, footerNewsData: {} });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Server Error');
  //   }
  // });


// app.use('/users',(req,res)=>{
//     fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Notion-Version": "2021-08-16",
//           "Authorization": `Bearer ${process.env.NOTION_KEY}`
//         }
//       })
//       .then(res => res.json())
//       .then(data => res.json(data))
//       .catch(error => console.error(error));
// })

app.get('/test/:id', async(req,res)=>{
 
    try{
        console.log("id",req.params.id);
        const notion= new Client({ auth:'secret_kb3A0fpt6vnABfDop4p16Zjv3g3ibAhMvrOuw7cH9pG'});
        const users=await notion.pages.retrieve(
            {
            page_id:req.params.id

        }
        );
        res.status(200).json({users})
        console.log(users);
        return users.json();
    }catch(err){
        console.log(err);
    }
})

app.get('/test',(req,res)=>{
    res.send("rendom text")
})

app.get('/ab?cd',(req,res)=>{
    res.send("rendom text")
})


// const AuthorType = new GraphQLObjectType({
//     name: 'Author',
//     fields: {
//       id: { type: GraphQLString },
//       name: { type: GraphQLString },
//     },
//   });


//   const PageType = new GraphQLObjectType({
//     name: 'Page',
//     fields: {
//       id: { type: GraphQLString },
//       title: { type: GraphQLString },
//       author: {
//         type: AuthorType,
//         resolve: async (parent) => {
//           const response = await notion.pages.retrieve({
             
//             page_id: parent.id,
//             // Assuming the "Author" property is a relation property
//             // Replace "author_property_name" with the actual property name
//             // and "authors_database_id" with the actual ID of the "Authors" database
//             // properties: Authors,
//           });
//           const authorPageId = response.properties.Authors.relation[0].id;
//           const authorResponse = await notion.pages.retrieve({ page_id: authorPageId });
//           return {
//             id: authorPageId,
//             name: authorResponse.properties.Name.title[0].text.content,
//           };
//         },
//       },
//     },
//   });
  
//   const QueryType = new GraphQLObjectType({
//     name: 'Query',
//     fields: {
//       pages: {
//         type: new GraphQLList(PageType),
//         resolve: async () => {
//           const response = await notion.databases.query({
//             database_id: '6887b78ae19b4434b130366a65498917',
//           });
//           return response.results.map((page) => ({
//             id: page.id,
//             title: page.properties.title[0].text.content,
//           }));
//         },
//       },
//     },
//   });

//   const schema = new GraphQLSchema({
//     query: QueryType,
//   });
  
//   app.get('/graphql', graphqlHTTP({
//       schema: schema,
//     graphiql: true,
// }));

app.get('/pages/:id/:domain', async (req, res) => {
    try {
        const mapping = domainTokenMap.find(mapping => mapping.domain === req.params.domain);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.domain}`);
        }
        console.log("mapp------",mapping);
        const token = mapping.token;
        const notion = new Client({ auth: token });
      // Fetch pages from the Notion API
      const response = await notion.databases.query({
        database_id: req.params.id, // Replace with the ID of your Notion database
      });
    //   console.log("respp---",response);
      // Extract relevant data from the response
      const pages = response.results.map((page) => ({
        id: page.id,
        PageData: page,
        AuthorsId: page.properties,
        Tags: page.properties.Tags.relation
      }));
  
      // Fetch author data for each page
      const pagesWithAuthors = await Promise.all(
        pages.map(async (page) => {
                console.log(page);
            const authorProperty = page.AuthorsId['Authors'];
            const tagsProperty = page.Tags;

          if (authorProperty && authorProperty.type === 'relation' && authorProperty.relation.length > 0) {
            const authorPageId = authorProperty.relation[0].id;
            const authorResponse = await notion.pages.retrieve({ page_id: authorPageId });
          
            const author = {
              id: authorPageId,
              icon:authorResponse.icon,
              name: authorResponse.properties['Name'].title[0].text.content,
            };
  
            const tags = await Promise.all(
                tagsProperty.map(async (tag) => {
                  const tagPageId = tag.id;
                  const tagResponse = await notion.pages.retrieve({ page_id: tagPageId });
                  const tagName = tagResponse.properties['Name'].title[0].text.content;
        
                  return { id: tagPageId, name: tagName };
                })
              );

              // let footerContent = null;
              // if (footerProperty && footerProperty.type === 'relation' && footerProperty.relation.length > 0) {
              //   const footerPageId = footerProperty.relation[0].id;
              //   const footerResponse = await notion.pages.retrieve({ page_id: footerPageId });
              //   // Assuming the footer content is stored in a property named 'Content'
              //   footerContent = footerResponse.properties['Content'].rich_text[0].text.content;
              // }
            
            return { ...page, author,tags };
          } else {
            return page;
          }
        })
      );
  
      res.json(pagesWithAuthors);
      console.log(pagesWithAuthors);
    } catch (error) {
      console.error('Error fetching data from Notion:', error);
      res.status(500).json({ error: 'An error occurred while fetching data from Notion' });
    }
  });

  app.get('/pagesfilter/:id/:domain', async (req, res) => {
    try {
        const mapping = domainTokenMap.find(mapping => mapping.domain === req.params.domain);
        if (!mapping) {
          throw new Error(`No matching domain found for ${req.params.domain}`);
        }
        const token = mapping.token;
        const notion = new Client({ auth: token });
      // Fetch pages from the Notion API
      const response = await notion.databases.query({
        database_id: req.params.id, 
        filter:{
            property:"Tags",
            relation:{
                contains:req.query.q
            },
        }    
        });
 
    //   console.log("respp---",response);
      // Extract relevant data from the response
      const pages = response.results.map((page) => ({
        id: page.id,
        PageData: page,
        AuthorsId: page.properties,
        Tags: page.properties.Tags.relation
      }));
  
      // Fetch author data for each page
      const pagesWithAuthors = await Promise.all(
        pages.map(async (page) => {
                console.log(page);
            const authorProperty = page.AuthorsId['Authors'];
            const tagsProperty = page.Tags;

          if (authorProperty && authorProperty.type === 'relation' && authorProperty.relation.length > 0) {
            const authorPageId = authorProperty.relation[0].id;
            const authorResponse = await notion.pages.retrieve({ page_id: authorPageId });
          
            const author = {
              id: authorPageId,
              icon:authorResponse.icon,
              name: authorResponse.properties['Name'].title[0].text.content,
            };
  
            const tags = await Promise.all(
                tagsProperty.map(async (tag) => {
                  const tagPageId = tag.id;
                  const tagResponse = await notion.pages.retrieve({ page_id: tagPageId });
                  const tagName = tagResponse.properties['Name'].title[0].text.content;
        
                  return { id: tagPageId, name: tagName };
                })
              );

            return { ...page, author,tags };
          } else {
            return page;
          }
        })
      );
  
      res.json(pagesWithAuthors);
      console.log(pagesWithAuthors);
    } catch (error) {
      console.error('Error fetching data from Notion:', error);
      res.status(500).json({ error: 'An error occurred while fetching data from Notion' });
    }
  });


  app.post('/FooterNewsLatterInsert/:id',async(req,res)=>{
    try{
      const newslettername=req.body.NewsLetterName;
      const newslettertext=req.body.NewsLetterText;
      const copywrite=req.body.CopyWrite;

      console.log("mapp------",req.params.id);
      
      fetchAdminData()
        // const mapping = AdminList && AdminList.find(mapping => mapping.email === req.params.email);
        // if (!mapping) {
        //   throw new Error(`No matching domain found for ${req.params.email}`);
        // }
        // const token = mapping.notionToken;
        const notion = new Client({ auth: process.env.NOTION_KEY });
        const responseresult = await notion.databases.query({
          database_id: req.params.id,
        
          page_size: 1,
        });
        const records = responseresult.results;
        console.log(records);
        if(records.length > 0 ){
          const lastRecordId=records[0].id;
          console.log(lastRecordId);
          const updateResponse=await notion.pages.update({
            page_id:lastRecordId,
            properties:{
              NewsLetterName: {
                title: [
                  {
                    text: {
                      content: newslettername,
                    },
                  },
                ],
              },
              NewsLetterText: {
                rich_text: [
                  {
                    text: {
                      content: newslettertext,
                    },
                  },
                ],
              },
              CopyWrite: {
                rich_text: [
                  {
                    text: {
                      content: copywrite,
                    },
                  },
                ],
              },
            },
          });
        //   const newPageId = updateResponse.id;
        // const masterTableId = process.env.NOTION_DATABASE_ID;
        // const relationResponse=await notion.pages.update({
        //   page_id:masterTableId,
        //   properties:{
        //     FooterNewsId:{
        //       relation:[
        //         {
        //           id:newPageId
        //         }
        //       ]
        //     }
        //   }
        // })
    
          res.send({massage:"Record Updated successfully" ,response:{updateResponse}});
            
        }else{
        const response= await notion.pages.create({
          parent:{database_id:req.params.id},
          properties:{
            NewsLetterName:{
              title:[
                {
                  text:{
                    content: newslettername,
                  }
                }
              ]
            },
            NewsLetterText:{
              rich_text:[{
                text:{
                  content:newslettertext,
                }
              }]
            },
            CopyWrite:{
              rich_text:[{
                text:{
                  content:copywrite,
                }
              }]
            }
          
          }
        })
      
        const newPageId = response.id;
        const masterTableId = process.env.NOTION_DATABASE_ID;
        const relationResponse=await notion.pages.update({
          page_id:masterTableId,
          properties:{
            FooterNewsId:{
              relation:[
                {
                  id:newPageId
                }
              ]
            }
          }
        })
        
        res.send({massage:"Record created successfully",response:{response,relationResponse}})
      }
    }
    catch(err){
      console.log(err);
    }
  })

  app.post('/FooterPageLink/:id',async(req,res)=>{
    try{
       const footerName=req.body.title;
      const footerDesc=req.body.description;
      const footerLinkType=req.body.linktype;
      const footerLink=req.body.option
      
      const notion = new Client({ auth: process.env.NOTION_KEY });
      const response = await notion.pages.create({
        parent: {
          database_id: req.params.id,
        },
        properties: {
          FooterName: {
            title: [
              {
                text: {
                  content: footerName,
                },
              },
            ],
          },
          FooterDesc: {
            rich_text: [
              {
                text: {
                  content: footerDesc,
                },
              },
            ],
          },
          FooterLinkType: {
            select: {
              name: footerLinkType,
            },
          },
          FooterLink: {
            url: footerLink,
          },
          // MasterCustomerPage:{
          //   relation:[
          //     {

          //       id:req.params.id,
          //     }
          //   ]
          // }
        },
      });

     
      res.send({massage:"record inserted succesfully",response:response})
    } catch(e){
      console.log(e);
    }
  })

  app.patch('/FooterPageLinkUpdate/:id',async(req,res)=>{
    const footerName=req.body.title;
   const footerDesc=req.body.description;
   const footerLinkType=req.body.linktype;
   const footerLink=req.body.option
   console.log(footerName,footerDesc,footerLinkType,footerLink,req.params.id);
   const notion = new Client({ auth: process.env.NOTION_KEY });
    try{
      
      const response = await notion.pages.update({
        page_id:req.params.id,
        properties: {
          FooterName: {
            title: [
              {
                text: {
                  content: footerName,
                },
              },
            ],
          },
          FooterDesc: {
            rich_text: [
              {
                text: {
                  content: footerDesc,
                },
              },
            ],
          },
          FooterLinkType: {
            select: {
              name: footerLinkType,
            },
          },
          FooterLink: {
            url: footerLink,
          },
        },
      });
      res.send({massage:"record updated succesfully",response:response})
    } catch(e){
      console.log(e);
    }
  })


app.listen(port,()=>{
    console.log(`starting server on ${port}`);
})

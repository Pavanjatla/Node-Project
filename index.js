const { response } = require("express");
const express = require("express");
const { request } = require("http");

const ourApp =express();

ourApp.get("/",(request,response) =>{
    response.json({message:"here is the message"});
});
ourApp.listen(5000,()=>console.log("server is listening"));
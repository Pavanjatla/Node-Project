require("dotenv").config();
const { response } = require("express");
const mongoose = require("mongoose");
const express = require("express");
const { request } = require("http");

//API

const Book = require("./API/book");
const Author = require("./API/author");
const Publication = require("./API/publication");


mongoose.connect(process.env.MONGO_URI,
{

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,

}
).then(() => console.log("connection Established"))
 .catch((err) =>  {
     console.log(err);
 });

const ourApp = express();

ourApp.use(express.json());


ourApp.use("/book",Book);
ourApp.use("/author",Author);
ourApp.use("/publication",Publication);

ourApp.get("/",(request,response) =>{
    response.json({message:"here is the message"});
});


ourApp.listen(5000,()=>console.log("server is listening"));
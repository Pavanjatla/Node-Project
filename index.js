const { response } = require("express");
const express = require("express");
const { request } = require("http");
const Database =require("./database");

const ourApp =express();

ourApp.get("/",(request,response) =>{
    response.json({message:"here is the message"});
});


//Books

ourApp.get("/book",(req,res) =>{

    return res.json({books:Database.Book});
});


ourApp.get("/book/:bookID",(req,res) =>{
    const getBook =Database.Book.filter(
        (book) => book.ISBN=== req.params.bookID);

    return res.json({book:getBook});

});


ourApp.get("/book/c/:category",(req,res) =>{
    const getCategory =Database.Book.filter(
        (book) => book.category.includes(req.params.category)
    );

    return res.json({book:getCategory});

});


ourApp.get("/book/b/:author",(req,res) =>{
    const getAuthor =Database.Author.filter(
        (book) => book.name.includes(req.params.author)
    );

    return res.json({book:getAuthor});

}); 

//Authors

ourApp.get("/author",(req,res) =>{

    return res.json({author:Database.Author});
});


ourApp.get("/author/:authorID",(req,res) =>{
    const getAuthor =Database.Author.filter(
        (book) => book.name=== req.params.authorID);

    return res.json({author:getAuthor});

});

ourApp.get("/author/a/:bookName",(req,res) =>{
    const getCategory =Database.Author.filter(
        (book) => book.books.includes(req.params.bookName)
    );

    return res.json({author:getCategory});

});

//Publishers




ourApp.listen(5000,()=>console.log("server is listening"));
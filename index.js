const { response } = require("express");
const express = require("express");
const { request } = require("http");
const Database =require("./database");

const ourApp = express();

ourApp.use(express.json());

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

//Publications



ourApp.get("/publications",(req,res) =>{

    return res.json({publications:Database.Publication});
});


ourApp.get("/publications/:publicationID",(req,res) =>{
    const getPublications =Database.Publication.filter(
        (book) => book.name=== req.params.publicationID);

    return res.json({publications:getPublications});

});

ourApp.get("/publications/p/:bookName",(req,res) =>{
    const getPublications =Database.Publication.filter(
        (book) => book.books.includes(req.params.bookName)
    );

    return res.json({author:getPublications});

});

//post
 
ourApp.post("/book/new",(req,res)=>{
    const {newBook}=req.body;

    Database.Book.push(newBook);
    return res.json(Database.Book);
});

ourApp.post("/author/new",(req,res)=>{
    const {newAuthor} =req.body;

    Database.Author.push(newAuthor);
    return res.json(Database.Author);
});

ourApp.post("/publication/new",(req,res)=>{
    const {Public} =req.body;
    Database.Publication.push(Public);   

    return res.json(Database.Publication);
});

//put book

ourApp.put("/book/update/:isbn",(req,res) => {
    const { updatedData } = req.body;
    const {isbn} = req.params;

   const book = Database.Book.map((book)=>{
        if(book.ISBN === isbn){
            return {...book, ...updatedData};
        }
        return book;
    });
    return res.json(book);
});

ourApp.put("/bookAuthor/update/:isbn",(req,res)=>{
    const { newAuthor} = req.body;
    const { isbn } = req.params;

    Database.Book.forEach((book)=>{
        if(book.ISBN === isbn){
            if(!book.authors.includes(newAuthor)){
                return book.authors.push(newAuthor);
            }
            return book;
        }
        return book;
    });

    Database.Author.forEach((author)=>{
        if(author.id === newAuthor){
            if(!author.books.includes(isbn)){
                return author.books.push(isbn);
            }
            return author;
        }
        return author;
    });


    return res.json({book : Database.Book, author:Database.Author});
});


// update book title name

ourApp.put("/book/updateTitle/:isbn",(req,res) => {
    const { updatedBookTitle } = req.body;
    const {isbn} = req.params;

   const book = Database.Book.map((book)=>{
        if(book.ISBN === isbn){
            book.title=updatedBookTitle.title;
            return book;
        }
        return book;
    });
    return res.json(book);
});


//put author

ourApp.put("/author/update/:id",(req,res) => {
    const { updatedAuthor } = req.body;
    const {id} = req.params;

   const author = Database.Author.map((author)=>{
        if(author.id === parseInt(id)){
            return {...author, ...updatedAuthor};
        }
        return author;
    });
    return res.json(author);
});

// update Author name

ourApp.put("/author/updateName/:id",(req,res) => {
    const { updatedAuthorName } = req.body;
    const {id} = req.params;

   const author = Database.Author.map((author)=>{
        if(author.id === parseInt(id)){
            author.name=updatedAuthorName.name;
            return author;
        }
        return author;
    });
    return res.json(author);
});



//put publications

ourApp.put("/publications/update/:id",(req,res) => {
    const { updatedPublication } = req.body;
    const {id} = req.params;

   const publication = Database.Publication.map((publication)=>{
        if(publication.id === parseInt(id)){
            return {...publication, ...updatedPublication};
        }
        return publication;
    });
    return res.json(publication);
});

ourApp.put("/bookPublication/update/:isbn",(req,res)=>{
    const { newPublication} = req.body;
    const { isbn } = req.params;

    Database.Book.forEach((book)=>{
        if(book.ISBN === isbn){
            if(!book.publication.includes(newPublication)){
                return book.publication.push(newPublication);
            }
            return book;
        }
        return book;
    });

    Database.Publication.forEach((publication)=>{
        if(publication.id === newPublication){
            if(!publication.books.includes(isbn)){
                return publication.books.push(isbn);
            }
            return publication;
        }
        return publication;
    });


    return res.json({book : Database.Book, publication:Database.Publication});
});

//Delete book

ourApp.delete("/book/delete/:isbn",(req,res)=>{
    const {isbn} = req.params;
    const filteredBooks = Database.Book.filter((book)=>book.ISBN !== isbn);

    Database.Book=filteredBooks;

    return res.json(Database.Book);
});


//Delete book Author

ourApp.delete("/book/delete/author/:isbn/:id",(req,res) =>{
    const { isbn, id} =req.params;
    Database.Book.forEach((book) =>{
        if(book.ISBN === isbn){
            if(!book.authors.includes(parseInt(id))){
                return;
            }
            book.authors = book.authors.filter((bookid)=> bookid !== parseInt(id));
            return book;
        }
        return book;
    });

    Database.Author.forEach((author) => {
        if(author.id === parseInt(id)){
            if(!author.books.includes(isbn)){
                return ;

            }
            author.books = author.books.filter((authorid) => authorid !==isbn);
            return author;
        }
        return author;
    });

    return res.json({ book:Database.Book , author : Database.Author});
});


//delete Author

ourApp.delete("/author/delete/:id",(req,res)=>{
    const {id} = req.params;
    const filteredAuthors = Database.Author.filter((author)=>author.id !== parseInt(id));

    Database.Author=filteredAuthors;

    return res.json(Database.Author);
});

//delete Publication

ourApp.delete("/publication/delete/:id",(req,res)=>{
    const {id} = req.params;
    const filteredPublications = Database.Publication.filter((publication)=>publication.id !== parseInt(id));

    Database.Publication=filteredPublications;

    return res.json(Database.Publication);
});


//Delete Book Publication


ourApp.delete("/book/delete/publication/:isbn/:id",(req,res) =>{
    const { isbn, id} =req.params;
    Database.Book.forEach((book) =>{
        if(book.ISBN === isbn){
            if(!book.publication.includes(parseInt(id))){
                return;
            }
            book.publication = book.publication.filter((bookid)=> bookid !== parseInt(id));
            return book;
        }
        return book;
    });

    Database.Publication.forEach((publication) => {
        if(publication.id === parseInt(id)){
            if(!publication.books.includes(isbn)){
                return ;

            }
            publication.books = publication.books.filter((publicid) => publicid !==isbn);
            return publication;
        }
        return publication;
    });

    return res.json({ book:Database.Book , publication : Database.Publication});
});






ourApp.listen(5000,()=>console.log("server is listening"));
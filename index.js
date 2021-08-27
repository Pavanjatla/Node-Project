require('dotenv').config();
const { response } = require("express");
const mongoose = require('mongoose');
const express = require("express");
const { request } = require("http");
//models
const BookModel =require('./schema/book');
const AuthorModel =require('./schema/author');
const PublicationModel =require('./schema/publication');

//API

const Book = require('./API/book');
const Author = require('./API/author');
const Publication = require('./API/publication');

const Database =require("./database");



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


//Books
/*

ourApp.get("/book", async (req,res) =>{
    const getAllBooks= await Book.find();

    return res.json(getAllBooks);
});


ourApp.get("/book/:bookID", async (req,res) =>{
    const getSpecificBook = await Book.findOne({ISBN : req.params.bookID});
    if(!getSpecificBook)
    {
        return res.json({error : `Does not Exist the Book ${req.params.bookID}`});
    }
    return res.json({book:getSpecificBook});

});


ourApp.get("/book/c/:category",async (req,res) =>{
    const getCategory = await Book.find({category : req.params.category});

    if(!getCategory)
    {
        return res.json({error : `no book in that category ${req.params.category}`});
    }
    return res.json({books:getCategory});
});


ourApp.get("/book/b/:authorID", async (req,res) =>{
        const getBook = await Book.find({authors : req.params.authorID});
    
        if(!getBook)
        {
            return res.json({error : `no book in that category ${req.params.bookID}`});
        }
        return res.json({books:getBook});
    }); 



//Authors

ourApp.get("/author",async (req,res) =>{
    const getAllAuthors = await Author.find();

    return res.json(getAllAuthors);
});


ourApp.get("/author/:authorID",async (req,res) =>{
    const getSpecificAuthor = await Author.findOne({id : req.params.authorID});
    if(!getSpecificAuthor)
    {
        return res.json({error : `Does not Exist the Author ${req.params.authorID}`});
    }
    return res.json({Author:getSpecificAuthor});

});

ourApp.get("/author/a/:bookName", async (req,res) =>{
    const getSpecificAuthor = await Author.findOne({books : req.params.bookName});
    if(!getSpecificAuthor)
    {
        return res.json({error : `Does not Exist the Author ${req.params.bookName}`});
    }
    return res.json({Author:getSpecificAuthor});


});

//Publications



ourApp.get("/publications",async(req,res) =>{

    const getAllPublications = await Publication.find();

    return res.json(getAllPublications);
});


ourApp.get("/publications/:publicationID",async (req,res) =>{
    const getSpecificPublication = await Publication.findOne({id : req.params.publicationID});
    if(!getSpecificPublication)
    {
        return res.json({error : `Does not Exist the Publication ${req.params.publicationID}`});
    }
    return res.json({Publication:getSpecificPublication});

});

ourApp.get("/publications/p/:bookName",async (req,res) =>{
    const getSpecificPublication = await Publication.findOne({books : req.params.bookName});
    if(!getSpecificPublication)
    {
        return res.json({error : `Does not Exist the Publication ${req.params.bookName}`});
    }
    return res.json({Publication:getSpecificPublication});

});

//post
 
ourApp.post("/book/new",async (req,res)=>{
    try {
        const {newBook}=req.body;
        await Book.create(newBook);
        return res.json({message:"message added succesfully"});

        
    } catch (error) {
        return res.json({error : error.message});
        
    }
});

ourApp.post("/author/new", async (req,res)=>{
    try {
        const {newAuthor}=req.body;
        await Author.create(newAuthor);
        return res.json({message:"Author added succesfully"});

        
    } catch (error) {
        return res.json({error : error.message});
        
    }
});

ourApp.post("/publication/new", async (req,res)=>{
    try {
        const {newPublication}=req.body;
        await Publication.create(newPublication);
        return res.json({message:"publication added succesfully"});

        
    } catch (error) {
        return res.json({error : error.message});
        
    }
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

ourApp.put("/book/updateAuthor/:isbn",async(req,res)=>{
    const { newAuthor} = req.body;
    const { isbn } = req.params;

    const updateBook = await Book.findOneAndUpdate(
        {
         ISBN:isbn,
        },
        {
          $addToSet :{
              authors : newAuthor
          }, 
        },
        {
            new : true,
        }
    );

    const updateAuthor = await Author.findOneAndUpdate(
        {
            id:newAuthor,
        },
        {
            $addToSet : {
                books:isbn,
            },
        },
        {
            new:true
        },
    );


    return res.json({books : updateBook, authors:updateAuthor,message:"new author updated"});
});


// update book title name

ourApp.put("/book/updateTitle/:isbn", async(req,res) => {
    const { Title } = req.body;
    const {isbn} = req.params;

   const updateBook = await Book.findOneAndUpdate(
       {
           ISBN:isbn,
       },
       {
           title : Title.title,
       },
       {
           new : true,
       },
   );
   return res.json({book : updateBook});
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

ourApp.put("/author/updateName/:id", async(req,res) => {
    const { Name } = req.body.name;
    const {id} = req.params;

   const updateAuthor = await Author.findOneAndUpdate(
       {
           id:id,
       },
       {
           name : Name,
       },
       {
           new : true,
       },
   )
   return res.json({author : updateAuthor});
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

ourApp.put("/book/updatePublication/:isbn",async (req,res)=>{
    const { newPublication} = req.body;
    const { isbn } = req.params;

    const updatedBook = await Book.findOneAndUpdate(
        {
         ISBN:isbn,
        },
        {
          $addToSet :{
              publication : newPublication,
          }, 
        },
        {
            new : true,
        }
    );

    const updatedPublication = await Publication.findOneAndUpdate(
        {
            id:newPublication,
        },
        {
            $addToSet : {
                books:isbn,
            },
        },
        {
            new:true
        }
    );


    return res.json({books : updatedBook, publications:updatedPublication ,message:"new Publication updated"});

});

//Delete book

ourApp.delete("/book/delete/:isbn",async(req,res)=>{
    const {isbn} = req.params;
    const updatedBooks=await Book.findOneAndDelete({
        ISBN :isbn,
    })
    return req.json({books : updatedBooks})
});


//Delete book Author

ourApp.delete("/book/delete/author/:isbn/:id",async (req,res) =>{
    const { isbn, id} =req.params;

   const updatedBooks = await Book.findOneAndUpdate({
       ISBN :isbn,
   },
   {
       $pull : {
           authors : parseInt(id),
       },
   },
   {
       new : true,
   }
   );

   const  updatedAuthor =await Author.findOneAndUpdate(
       {
           id : parseInt(id),
       },
       {
           $pull :{
               books : isbn,
           },
       },
       {
           new : true
       }
   );
    return res.json({ book:updatedBooks , author : updateAuthor, message : "author deleted "});
});


//delete Author

ourApp.delete("/author/delete/:id",async(req,res)=>{
    const {id} = req.params;
    const updatedAuthors=await Author.findOneAndDelete({
        id :parseInt(id),
    });
    return req.json({authors : updatedAuthors})
});

//delete Publication

ourApp.delete("/publication/delete/:id",async(req,res)=>{
    const {id} = req.params;
    const updatedPublication=await Publication.findOneAndDelete({
        id :parseInt(id),
    });
    return req.json({Publication : updatedPublication})
});


//Delete Book Publication


ourApp.delete("/book/delete/publication/:isbn/:id",async(req,res) =>{
    const { isbn, id} =req.params;
    const updatedBooks = await Book.findOneAndUpdate({
        ISBN :isbn,
    },
    {
        $pull : {
            publication : parseInt(id),
        },
    },
    {
        new : true,
    }
    );
 
    const  updatedPublication =await Publication.findOneAndUpdate(
        {
            id : parseInt(id),
        },
        {
            $pull :{
                books : isbn,
            },
        },
        {
            new : true
        }
    );
     return res.json({ book:updatedBooks , author : updatedPublication, message : "Pulication deleted "});
 });
 
*/





ourApp.listen(5000,()=>console.log("server is listening"));
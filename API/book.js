const Router =require("express").Router();

const AuthorModel = require("../schema/author");
const BookModel =require("../schema/book");
const PublicationModel = require("../schema/publication");

Router.get("/", async (req,res) =>{
    const getAllBooks= await BookModel.find();
    

    return res.json(getAllBooks);
});


Router.get("/:bookID", async (req,res) =>{
    const getSpecificBook = await BookModel.findOne({ISBN : req.params.bookID});
    if(!getSpecificBook)
    {
        return res.json({error : `Does not Exist the Book ${req.params.bookID}`});
    }
    return res.json({book:getSpecificBook});

});

Router.get("/c/:category",async (req,res) =>{
    const getCategory = await BookModel.find({category : req.params.category});

    if(!getCategory)
    {
        return res.json({error : `no book in that category ${req.params.category}`});
    }
    return res.json({books:getCategory});
});


Router.get("/b/:authorID", async (req,res) =>{
    const getBook = await BookModel.find({authors : req.params.authorID});

    if(!getBook)
    {
        return res.json({error : `no book in that category ${req.params.bookID}`});
    }
    return res.json({books:getBook});
}); 


//post

Router.post("/new",async (req,res)=>{
    try {
        const {newBook}=req.body;
        await BookModel.create(newBook);
        return res.json({message:"message added succesfully"});

        
    } catch (error) {
        return res.json({error : error.message});
        
    }
});

//put

Router.put("/updateTitle/:isbn", async(req,res) => {
    const { Title } = req.body;
    const {isbn} = req.params;

   const updateBook = await BookModel.findOneAndUpdate(
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

Router.put("/updateAuthor/:isbn",async(req,res)=>{
    const { newAuthor} = req.body;
    const { isbn } = req.params;

    const updateBook = await BookModel.findOneAndUpdate(
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

    const updateAuthor = await AuthorModel.findOneAndUpdate(
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


Router.put("/updatePublication/:isbn",async (req,res)=>{
    const { newPublication} = req.body;
    const { isbn } = req.params;

    const updatedBook = await BookModel.findOneAndUpdate(
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

    const updatedPublication = await PublicationModel.findOneAndUpdate(
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

Router.delete("/delete/:isbn",async(req,res)=>{
    const {isbn} = req.params;
    const updatedBooks=await BookModel.findOneAndDelete({
        ISBN :isbn,
    })
    return req.json({books : updatedBooks})
});


//Delete book Author

Router.delete("/delete/author/:isbn/:id",async (req,res) =>{
    const { isbn, id} =req.params;

   const updatedBooks = await BookModel.findOneAndUpdate({
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

   const  updatedAuthor =await AuthorModel.findOneAndUpdate(
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


Router.delete("/delete/publication/:isbn/:id",async(req,res) =>{
    const { isbn, id} =req.params;
    const updatedBooks = await BookModel.findOneAndUpdate({
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
 
    const  updatedPublication =await PublicationModel.findOneAndUpdate(
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


module.exports = Router;
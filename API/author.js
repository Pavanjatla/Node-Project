const Router =require("express").Router();

const AuthorModel = require("../schema/author");

Router.get("/",async (req,res) =>{
    const getAllAuthors = await AuthorModel.find();

    return res.json(getAllAuthors);
});


Router.get("/:authorID",async (req,res) =>{
    const getSpecificAuthor = await AuthorModel.findOne({id : req.params.authorID});
    if(!getSpecificAuthor)
    {
        return res.json({error : `Does not Exist the Author ${req.params.authorID}`});
    }
    return res.json({Author:getSpecificAuthor});

});

Router.get("/a/:bookName", async (req,res) =>{
    const getSpecificAuthor = await AuthorModel.findOne({books : req.params.bookName});
    if(!getSpecificAuthor)
    {
        return res.json({error : `Does not Exist the Author ${req.params.bookName}`});
    }
    return res.json({Author:getSpecificAuthor});


});


//post

Router.post("/new", async (req,res)=>{
    try {
        const {newAuthor}=req.body;
        await AuthorModel.create(newAuthor);
        return res.json({message:"Author added succesfully"});

        
    } catch (error) {
        return res.json({error : error.message});
        
    }
});

// update Author name

Router.put("/updateName/:id", async(req,res) => {
    const { Name } = req.body.name;
    const {id} = req.params;

   const updateAuthor = await AuthorModel.findOneAndUpdate(
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

//detele

Router.delete("/delete/:id",async(req,res)=>{
    const {id} = req.params;
    const updatedAuthors=await AuthorModel.findOneAndDelete({
        id :parseInt(id),
    });
    return req.json({authors : updatedAuthors})
});


module.exports= Router;
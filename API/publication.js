const Router =require("express").Router();
const PublicationModel = require("../schema/publication");

Router.get("/",async(req,res) =>{

    const getAllPublications = await PublicationModel.find();

    return res.json(getAllPublications);
});


Router.get("/:publicationID",async (req,res) =>{
    const getSpecificPublication = await PublicationModel.findOne({id : req.params.publicationID});
    if(!getSpecificPublication)
    {
        return res.json({error : `Does not Exist the Publication ${req.params.publicationID}`});
    }
    return res.json({Publication:getSpecificPublication});

});

Router.get("/p/:bookName",async (req,res) =>{
    const getSpecificPublication = await PublicationModel.findOne({books : req.params.bookName});
    if(!getSpecificPublication)
    {
        return res.json({error : `Does not Exist the Publication ${req.params.bookName}`});
    }
    return res.json({Publication:getSpecificPublication});

});

Router.post("/new", async (req,res)=>{
    try {
        const {newPublication}=req.body;
        await PublicationModel.create(newPublication);
        return res.json({message:"publication added succesfully"});

        
    } catch (error) {
        return res.json({error : error.message});
        
    }
});

//delete Publication

Router.delete("/delete/:id",async(req,res)=>{
    const {id} = req.params;
    const updatedPublication=await PublicationModel.findOneAndDelete({
        id :parseInt(id),
    });
    return req.json({Publication : updatedPublication})
});

//put publications

Router.put("/updateName/:id",async(req,res) => {
    const { updatedPublication } = req.body;
    const {id} = req.params;

    const updatePublication = await PublicationModel.findOneAndUpdate(
        {
            id : parseInt(id),
        },
        {
            name:updatedPublication.name,
        },
        {
            new : true,
        },
    );
    return res.json({book : updatePublication});
 });

module.exports = Router;
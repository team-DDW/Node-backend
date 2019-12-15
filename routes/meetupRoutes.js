const express = require('express');
const router = express.Router();
const Meetup = require('../models/Meetup');

//create new meetup
router.post("/create",(req,res)=>{
    let meetup = new Meetup()
     meetup.title = req.body.title
     meetup.description = req.body.description
     meetup.image = req.body.image
     meetup.user = req.body.user

     meetup.save()
     .then(() => res.json("Successfully added new meetup"))
    .catch(err => res.json(err))
})

//add contributers
router.put("/contributors/:id",(req,res)=>{
    Meetup.findByIdAndUpdate(req.params.id,{$addToSet:{contributors:req.body.contributors}},(err,updatedModel)=>{
        if(err)
        res.json(err)
    })
    .then(()=>res.json("added new contributor"))
    .catch(err=>res.json(err))
})

//update a meetup
router.put("/:id", (req, res) => {
    Meetup.findByIdAndUpdate(req.params.id, req.body, (err, updatedModel) => {
        if (err)
            res.json(err)
    })
        .then(() => res.json("successfully updated"))
        .catch(err => res.json(err))
})

router.delete("/:id", (req, res) => {
    Meetup.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            console.log(err)
            res.json(err)
        }
    })
        .then(() => res.json("Successfully deleted"))
        .catch(err => res.json(err))
})

//get a specific meetup
router.get("/:id",(req,res)=>{
    Meetup.findById(req.params.id)
    .then(m=>res.json(m))
    .catch(err=>res.json(err))
})

//get all meetup
router.get("/",(req,res)=>{
    Meetup.find()
    .then(m=>res.json(m))
    .catch(err=>res.json(err))
})

module.exports = router
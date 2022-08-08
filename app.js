var express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser')
const _ = require('lodash');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyparser.urlencoded({extended:true}))
// use res.render to load up an ejs view file

mongoose.connect("mongodb+srv://webapp:ninja123@cluster0.ubaxz.mongodb.net/noteDB");   
let textArray = [];

const noteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "please insert a note"]
    }
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [noteSchema]
})

const Note = mongoose.model("Note", noteSchema);
const List  = mongoose.model("List", listSchema);





app.get('/', function(req, res) {
      console.log(req.params);       
//    console.log(notesArray);
    
     res.redirect("/Home"); 
  //   return textArray;

});

app.get('/about', function(req, res) {
    res.render('pages/about');
 });
 
 
 app.get("/:ref", (req, res)=>{
     const newPage = _.capitalize(req.params.ref);
     console.log("here in: " + newPage);
     
     List.findOne({name: newPage}, (err, result)=>{
         if(!err){
            if(!result){
                //  console.log("creating new");
                const list = new List({
                    name: newPage,
                    items: []
                 });
                 list.save();
                 res.redirect("/"+newPage);
           
            }else{
                // console.log("found " + newPage);
                // console.log(result)
               res.render("pages/list", {
                  result: result,
               });
            }
         }
     })
     
 });



app.post("/add", (req, res) => {
    // console.log("here");
    const newNote = req.body.listName;
    const listName = req.body.list;
    // console.log(newNote);
    const note = new Note ({
        text: newNote,
    });

    List.findOne({name: listName}, (err, foundList)=>{
        if(!err){
            foundList.items.push(note);
            foundList.save();
            res.redirect("/"+listName);
        }
    })
    
});

// about page



app.use("/update", (req, res)=>{
     let list_id = req.body.data[0];
     let txt_id = req.body.data[1];
    //  let listName = req.body.data[0];
    //  console.log(([list_id, txt_id]));
    List.findOneAndUpdate({_id: list_id}, {$pull: {items: {_id: txt_id}}}, (err, foundList)=>{
       if(!err){
          console.log("found and removed");
        //   console.log(foundList);
          res.redirect("/"+foundList.name);
       }
    })
    //  List.findById(list_id, (err, rep)=>{
    //     if(!err){
            
    //         // rep.items.forEach((k)=>{
    //         //     rep.items.
    //         //     console.log(k.id);
    //         // })
    //     }
    //  })
     
    //  console.log("in update route");
    // if(listName=="Home"){
    //     Note.findByIdAndRemove(txt_id, (err)=>{
    //        if(!err){
    //         console.log("successfully deleted entry in Home") 
    //        }
    //     })
    // }else{
    //     List.findByIdAndRemove(txt_id, (err)=>{
    //         if(!err){
    //          console.log("successfully deleted entry in Home") 
    //         }
    //      })
    // }
    // res.redirect("/" + listName);
     
    //  console.log(txt);

})



app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is listening on port ${process.env.PORT || 3000}`);
});

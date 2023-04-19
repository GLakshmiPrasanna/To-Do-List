const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const date=require(__dirname+"/date.js");
const _=require('lodash');

const app=express();

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

app.set("view engine","ejs");

// let items=[];
// let works=[];
// const items=[];
// const works=[];

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true 
    }
});

const ItemsModel=mongoose.model('Item',itemsSchema);


const customListSchema=new mongoose.Schema({
    name : String,
    items:[itemsSchema]
});

const CustomListModel=mongoose.model('CustomList',customListSchema);

let day=date.curDay();
app.get('/',function(req,res){

    // let day=date.curDay();

    // let day=date.curDate(); 
    

    ItemsModel.find({}).then(function(items){
        if(items.length==0){
            const start=new ItemsModel({
                name:"Welcome to your To-Do-List!"
            });
            start.save();
            res.redirect('/');
        }
        else{
            res.render('list',{eTitle:day , eNew:items});
        }      
    }).catch(function(err){
        console.log(err)
    })   
})

app.post('/',function(req,res){
    // let item=req.body.eItem;
    const item=req.body.eItem;
    const btn=req.body.eBtn;
    // if(req.body.eBtn==="Work List"){
    //     works.push(item);
    //     res.redirect('/work');
    // }
    // else{
    //     items.push(item);
    //     res.redirect("/");
    // }
    const itemNew=new ItemsModel({
        name:item
    })
    if(btn===day){
        itemNew.save();
        res.redirect('/');
    }
    else{
        CustomListModel.findOne({name:btn}).then(function(lists){
            lists.items.push(itemNew);
            lists.save();
            res.redirect('/'+btn);
        }).catch(function(err){
            console.log(err);
        })
    }
})


app.post('/delete',function(req,res){
    const checkbox=req.body.checkbox;
    const title=req.body.title;

    if(title===day){
        ItemsModel.findByIdAndDelete(checkbox).then(function(){
            res.redirect('/');
            // console.log("Deleted Successfully");
        }
        ).catch(function(err){
            console.log(err);
        })
    }
    else{
        CustomListModel.findOneAndUpdate({
            name:title
        },
        {
            $pull:{items:{_id:checkbox}}
        }
            ).then(function(){
            res.redirect('/'+title);
            // console.log("Deleted Successfully");
        }
        ).catch(function(err){
            console.log(err);
        })
    }
    
})

let customName;

app.get('/:customPage',function(req,res){
    customName=_.capitalize(req.params.customPage);
    CustomListModel.findOne({name:customName}).then(function(lists){
        if(!lists){
            const begin=new CustomListModel({
                name:customName,
                items:[{
                    name:"Welcome to your To-Do-List!"
                }]
            });
            begin.save();
            res.redirect('/'+customName);
        }
        else{
            res.render('list',{
                eTitle:lists.name, 
                eNew:lists.items
            });
        }
    }
    ).catch(function(err){
        console.log(err);
    })
}) 

// CustomListModel.deleteMany({name:"favicon.ico"}).then(function(items){
//     console.log(items);
// }).catch(function(err){
//     console.log(err);
// })
// app.get('/work',function(req,res){
    
//     res.render('list',{eTitle:"Work List",eNew:works})
// })

app.listen(3000,function(){
    console.log("Server started!!")
})
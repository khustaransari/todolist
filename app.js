const express=require("express");
const bodyParser=require('body-parser');
const mongoose=require("mongoose");
const app=express();
app.use(bodyParser.urlencoded({extended:true})); 
app.set('view engine', 'ejs');
app.use(express.static("public"));


let whichlisthascome;

mongoose.connect("mongodb+srv://admin-khustar:1234567890@cluster0.bjfuh.mongodb.net/todolistDB",{useNewUrlParser:true});
// make schema

const itemsSchema={
  name:String
};
const Item=mongoose.model("Item",itemsSchema);     // variable name should be in capatalize and singular form

const item1=new Item(
  {
    name:"Welcome To Do List"
  }
)
const item2=new Item(
  {
    name:"-->>Hit Like Share Button"
  }
)
const item3=new Item(
  {
    name:"Delete The Notes!"
  }
)
const defaultArray=[item1,item2,item3];



// let items=[];
// let worklist=[]; THIS TWO ARRAY STORE DATA IN LOCALLY WHEN WE RESTART THR SERVER DATA WILL LOOSE SO WE USE DATABASE
app.get("/",function(req,res)
{
//     var days;
//   var today=new Date();
//   var options={
//   weekday:"long",
//   day:"numeric",
//   month:"long"
//   };
//  days=today.toLocaleDateString("hi-IN",options);
  // var currentday=today.getDay();//return 0 to 6 number wise sunday-saturday;
//   if(currentday===6||currentday===0) //using ejs
//   { day="weekend";}
// //   res.send("It is weekend");
//   else{
//   day="weekday";}
//   res.render("list",{kindOfDay:day});
//   res.send("It is week day");  // we send multiple data using send a multiple html file as wells res.write;
// switch(currentday)
// {
//   case 0:
//     day="Sunday";
//     break;
//     case 1:
//     day="Monday";
//     break;
//     case 2:
//     day="Tuesday";
//     break;
//     case 3:
//     day="Wednesday";
//     break;
//     case 4:
//     day="Thrusday";
//     break;
//     case 5:
//     day="Friday";
//     break;
//     case 6:
//     day="saturday";
//     break;
// default:console.log("default");

// }


Item.find({},function(err,foundItems)
{
  // if(err)
  // console.log("Error");
  // else 
  if(foundItems.length==0)
   {
 Item.insertMany(defaultArray,function(err)
{
  if(err)
  console.log("Show an Error");
  else
  console.log("Succesfully insert New Elements");
});
res.redirect("/");
  }
  res.render("list",{kindOfDay:"today",newItems:foundItems});  // here foundItems is documents everthing return 
})                // first curly bracis has condition 
// res.render("list",{kindOfDay:"Today",newItems:items});
});
// list schema

const listSchema={
  name:String,
  items:[itemsSchema]
}
const List=mongoose.model("List",listSchema);


app.get("/:customListName",function(req,res)  //Use for creating dynamic routes
{
  const customListName=req.params.customListName;
  console.log(customListName);
  List.findOne({name:customListName},function(err,foundList){
//find one use to identify similar elements in lists collection it return a object.
    console.log(foundList);
  if(!err)
  {
    if(!foundList)
    {
      const list=new List(
        {
          name:customListName,
          items:defaultArray
        }
      )
      console.log("Not Found")
      list.save();
      res.redirect("/"+customListName);
    }
    else
    {
      res.render("list",{kindOfDay:foundList.name,newItems:foundList.items});
    }
  }
  
 });

 
})

app.post("/",function(req,res)
{
  let itemName=req.body.newItem;
  whichlisthascome=req.body.lists;
  console.log(whichlisthascome);
  const itemdocument=new Item(
    {
      name:itemName
    }
  )
  if(whichlisthascome=="today")
{
  itemdocument.save();
  res.redirect("/");
}

  else
  {
    List.findOne({name:whichlisthascome},function(err,foundList)
    {
      foundList.items.push(itemdocument);
      foundList.save();
      res.redirect("/"+whichlisthascome); 
    })
  }

  // let newItem=defaultArray.push(itemName);
  // const list2=new List(
  //   {
  //     name:whichlisthascome,
  //     items:itemdocument
  //   }
  // )
  // list2.save();
 
  
  // defaultArray.push(itemdocument);
   
});
// for deleting 
app.post("/delete",function(req,res)
{
const checkedItemId=req.body.checkbox;
const checkwhichlisthascome=req.body.listItem;
console.log(checkwhichlisthascome);
if(checkwhichlisthascome=="today")
{

  Item.findByIdAndRemove(checkedItemId,function(err)
{
if(!err)
  {
  console.log("successfully deleted");
  res.redirect("/");
  }
});
}
else
{
  
List.findOneAndUpdate({name:checkwhichlisthascome},{$pull:{items:{_id:checkedItemId}}},function(err,foundList)
{
  if(!err)
  {
    res.redirect("/" + checkwhichlisthascome);
  }
})
  
 
}

});




app.get("/work",function(req,res)
{
 res.render("list",{kindOfDay:"Work List",newItems:worklist})
});
// app.post("/work",function(req,res)
// {
//  let input=req.body.newItem;
//  worklist.push(input);
//  res.redirect("/work");
// });

app.get("/about",function(req,res)
{
 res.render("about");
});
let port=process.env.PORT;
if(port==null || port=="")
{
  port=3000;
}
app.listen(port,function()
{
    console.log("Server running on 3000");
})
// templating is change of html content using logic inside our server;
 
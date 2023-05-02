//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// erasing arrays to use mogoose
// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

async function connect() {
  await mongoose.connect("mongodb+srv://jpatrick6420:test123@cluster0.suqfhou.mongodb.net/todolistDB");
}
connect()

const itemsSchema = new mongoose.Schema({
  name: String
});
const Item = new mongoose.model("Item", itemsSchema)

const item1 = new Item({
  name: "Feed Kaja and Roxy"
});
const item2 = new Item({
  name: "Run on treadmill"
})
const item3 = new Item({
  name: "Work on Coding"
})
defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List = mongoose.model("List", listSchema)

// item1.save();
// item2.save();
// item3.save();
// let things = ""
// async function find() {
//   const items = await Item.find({});
//   things = items
//   console.log(things)
// }




app.get("/", function (req, res) {

  // find({})


  async function find() {

    const items = await Item.find({});
    if (items.length === 0) {
      Item.insertMany(defaultItems
        //   ,err => {
        //   if (err) { return handleError(err) }
        // }
      );
      res.redirect("/")
    } else {
      res.render("list", { listTitle: "Today", items: items })
    }
  }
  find({})
  // res.render("list", { listTitle: "Today", things: things });
}

);

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;



  const item = new Item({
    name: itemName
  })

  if (listName === "Today") {
    item.save();
    res.redirect("/")
  } else {
    async function findOne() {
      const foundList = await List.findOne({ name: listName });
      foundList.items.push(item);
      foundList.save();
    }
    findOne();
    setTimeout(() => { res.redirect("/" + listName) }, 100)
  }
});

app.post("/delete", function (req, res) {

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;





  if (listName === "Today") {

    async function findById() {
      await Item.findByIdAndDelete(checkedItemId);
      res.redirect("/")
    };
    findById();

  } else {
    async function findOneAndUpdate() {
      await List.findOneAndUpdate(
        { name: listName }, { $pull: { items: { _id: checkedItemId } } }
      );
      res.redirect("/" + listName);

    };
    findOneAndUpdate();
  }
});






app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  async function findOne() {
    const foundList = await List.findOne({ name: customListName })
    if (!foundList) {
      // Create a new list 
      const list = new List({
        name: (customListName),
        items: defaultItems
      });
      list.save()
      res.redirect("/" + (customListName))
    } else {
      // Create code if list exists 
      res.render("list", { listTitle: foundList.name, items: foundList.items })
    }
  }

  findOne()






})
// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000 , function () {
  console.log("Server started on port 3000");
});

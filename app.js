const express = require("express");
const bodyParser = require('body-parser');
const Ctgamestudio = require("./model/Ctgamestudio")
const User = require("./model/User")
const mongoose = require("mongoose");
const process = require("./processing")

// connect to database
mongoose.connect(
  "mongodb://localhost:27017/ctstudio",
  { useNewUrlParser: true },
  error => {
    if (!error) {
      console.log("Success Connection");
    } else {
      console.log("Error connecting the Database");
    }
  }
);

// start express app
const app = express();
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const excludedUsers = [
  'werneburg@collide.info',
  'ingmar.werneburg@senckenberg.de',
  'manske@collide.info',
  'hoppe@collide.info',
  'jessica.feldkamp@stud.uni-due.de',
  'alexander.kocur@stud.uni-due.de',
  'anna.taphorn@stud.uni-due.de',
  'benjamin.koelner@gmail.com',
  'computational.thinking@collide.info',
  'felix.mucha@collide.info',
  'hoppe@collide.info',
  'maze0@collide.info',
  'MB0@collide.info',
  'MS0@collide.info',
  'LH0@collide.info',
  'AD2@collide.info',
  'AD3@collide.info',
  'EY1@collide.info',
  'EY2@collide.info',
  'EY3@collide.info',
  'HV1@collide.info',
  'SK3@collide.info'
];


//Routes
app.get("/", async function(req, res){
  // users = await Ctgamestudio.aggregate([
  //     { $lookup:
  //       { from: "users",
  //         localField: "owner",
  //         foreignField: "_id",
  //         as: "new_user"
  //       }
  //     },
  //     { $project:
  //       { new_user : {name: 1},
  //         owner: 1
  //       }
  //     },
  //     { $group:
  //       { _id: "$owner",
  //         name: { $first: "$new_user.name" }
  //       }
  //     },
  //     {
  //       $match:
  //       {
  //         name: {
  //           $not: { $size: 0 }
  //         }
  //       }
  //     }
  // ]);
  // console.log(users[0].name)
  // users = await User.find();
  user_ids = await Ctgamestudio.distinct("owner");
  users = await User.find({_id : {$in : user_ids}, email : {$nin : excludedUsers}}).select('name')
  levels = await Ctgamestudio.distinct("level");
  res.render("index", {users: users, levels : levels.sort()});

});

app.post("/", (req, res) => {
  console.log(req.body.user)
  console.log(req.body.level)
  let idToSearch = mongoose.Types.ObjectId(req.body.user);
  let levelToSearch = String(req.body.level);
  // let idToSearch = mongoose.Types.ObjectId("5badc8e4ad41aedfe7363962");
  Ctgamestudio.find({
    owner: idToSearch,
    level: levelToSearch,
    title: { $ne: "get" }
  }).exec().then(result => {
    data = process.process(result);
    if(data){
      res.render("index", { data: data});
    }
    res.render("index", { error: true});
  })
});

app.listen(3000)

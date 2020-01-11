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
  user_ids = await Ctgamestudio.distinct("owner");
  users = await User.find({_id : {$in : user_ids}, email : {$nin : excludedUsers}}).select('name')
  levels = await Ctgamestudio.distinct("level");
  res.render("index", {users: users, levels : levels.sort()});

});

app.post("/", async function(req, res) {
  if (!req.body.user){
    // console.log(req.body.level)
    var data = await get_level_data(String(req.body.level))
    console.log(data[0]);
    res.render("index", {data: data});
  }else{
    // console.log(req.body.level)
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
  }
});

async function get_level_data(level){
  // get the number of levels most of the users have passed
  // and define the users passed more thean this number as high success
  // otherwise low success
  var levels_most_users_passed = number_of_levels();
  var high_success_users = await get_users_data(level, "$gt");
  var low_success_users = await get_users_data(level, '$lt');
  var average_success_users = await get_users_data(level, '$eq');
  var trace1 = {
    x: ['creates', 'changes', 'runs', 'time'],
    y: high_success_users,
    name: 'High success',
    marker: { color: 'rgb(85,202,106)' },
    type: 'bar'
  };

  var trace2 = {
    x: ['creates', 'changes', 'runs', 'time'],
    y: average_success_users,
    name: 'Average',
    marker: { color: 'rgb(27,141,253)' },
    type: 'bar'
  };

  var trace3 = {
    x: ['creates', 'changes', 'runs', 'time'],
    y: low_success_users,
    name: 'Low success',
    marker: { color: 'rgb(234,54,81)' },
    type: 'bar'
  };

  var data = [trace1, trace2, trace3];
  var layout = {
    title: "LEVEL " + level,
    barmode: 'group'
  };
  var plot = [data, layout];
  return plot;
}

async function get_users_data(level, type_of_users){
  var included_users= await User.find({email :{$nin :excludedUsers}}).select("_id");
  var included_users_ids = included_users.map(a => a._id);
  var users_ids =
    await Ctgamestudio.aggregate(
      [{
        $match: {
          title: "win",
          owner : {$in : included_users_ids}
        }
      },
      {
        $group:
          { _id: { owner: "$owner", level: "$level" } }
      },
      {
        $group: { _id: "$_id.owner", count: { $sum: 1 } }
      },
        { $match: { count: { [type_of_users] : 5 } } }
      ]).exec().then(result => {
        return result.map(a => a._id);;
      });
  var users_data = await Ctgamestudio.aggregate(
    [{
      $match: {
        level: level,
        owner: { $in: users_ids }
      }
    },
    {
      $group:
        { _id: "$owner", logs: { $push: "$$ROOT" } }
    }
    ]).exec().then(result => {
      if (result){
        data = process.get_level_data(result);
        return data;
      }
    });
  return users_data;
}

async function number_of_levels(){
  levels_passed_by_each_user = await Ctgamestudio.aggregate(
    [{
        $match: { title: "win" }
      },
      { $group:
        { _id: { owner: "$owner", level: "$level" }}
      },
      { $group: {
        _id: "$_id.owner",
        count: { $sum: 1 }
        }
    }]
  );
  let number_of_levels = levels_passed_by_each_user.map(a => a.count);
  return get_most_frequent_levels_passed(number_of_levels);
}

function get_most_frequent_levels_passed(array) {
  if (array.length == 0)
    return null;
  var modeMap = {};
  var maxEl = array[0], maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

app.listen(3000)

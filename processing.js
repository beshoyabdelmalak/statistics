
module.exports = {
  process : function (logs) {
      let first = true;
      let begin_time = new Date();
      let number_of_blocks;
      let changes = [];
      let changes_time = [];
      let wins = []
      let wins_time = []
      let tests = []
      let tests_time = [];
      if(logs.length == 0){
        return null;
      }
    try {
      logs.forEach(function (log) {
        // for the first block, count the number of blocks given by the game
        if (first) {
          number_of_blocks = (log.blockly.match(/<block/g) || []).length;
          begin_time = log.publishedDate;
          changes.push(number_of_blocks);
          changes_time.push(0);
          first = false;
        }
        // if it reate a variable, count it as adding one block
        if (log.title == "change" && log.event.includes("var_create")) {
          number_of_blocks += 1;
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate))
        }
        // if blocks were created, add the number of them to the total blocks number of the program
        else if (log.title == "change" && log.event.includes("create")) {
          let event = JSON.parse(log.event);
          number_of_blocks += event.ids.length;
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate))
        }
        // if blocks were deleted, subtract the number of deleted from the total number of blocks
        else if (log.title == "change" && log.event.includes("delete")) {
          let event = JSON.parse(log.event);
          number_of_blocks -= event.ids.length;
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate))
        }
        else if (log.title == "change" && (log.event.includes("change") || log.event.includes("move"))) {
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate))
        }
        else if (log.title == "win") {
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate))
          wins.push(number_of_blocks);
          wins_time.push(time_diff(begin_time, log.publishedDate))
          throw new Error();
        }
        // if the code was tests, mark the time of the test
        else if (log.title == "test") {
          // tests.push(number_of_blocks);
          changes.push(number_of_blocks);
          changes_time.push(time_diff(begin_time, log.publishedDate))
          tests.push(number_of_blocks);
          tests_time.push(time_diff(begin_time, log.publishedDate))
        }
      });
    }
    catch (e) {
    }
    var changes_plot = plot_line(changes_time, changes);
    var tests_plot = plot_points(tests, tests_time, "test");
    var wins_plot = plot_points(wins, wins_time, "win")
    // var layout = plot_tests_and_wins(tests_time, wins_time, changes);
    var data = [changes_plot, tests_plot, wins_plot];
    var layout = {
      xaxis: {
        title: 'Time in Seconds'
      },
      yaxis: {
        title: 'Number of Blocks'
      }
    };
    return [data, layout];
  }
};

function plot_line(x_axis, y_axis){
  var trace = {
    x: x_axis,
    y: y_axis,
    mode: 'lines+markers',
    marker: {
      color: 'rgb(55, 128, 191)',
      size: 10
    },
    line: {
      color: 'rgb(55, 128, 191)',
      width: 3
    },
    name : 'Change'
  };
  return trace;
}

// function plot_tests_and_wins(tests, wins, changes) {
//   var shapes = [];
//   var max_y = Math.max(...changes);
//   tests.forEach(function (test){
//     shapes.push({
//       type: 'line',
//       x0: test,
//       y0: 0,
//       x1: test,
//       y1: max_y,
//       line: {
//         color: 'rgb(219, 64, 82)',
//         width: 3
//       }
//     },)
//   });
//   wins.forEach(function(win){
//     shapes.push({
//       type: 'line',
//       x0: win,
//       y0: 0,
//       x1: win,
//       y1: max_y,
//       line: {
//         color: 'rgb(50,205,50)',
//         width: 3
//       }
//     })
//   })
//   var layout = {
//     shapes: shapes
//   };
//   return layout;
// }

function plot_points(number_of_blocks, time, type){
  if(type == "test"){
    color = 'rgb(255, 0, 0)'
    name= 'Test'
  }else{
    color = 'rgb(50,205,50)'
    name = 'Win'
  }
  var trace = {
    x: time,
    y: number_of_blocks,
    mode: 'markers',
    marker: {
      color: color,
      size: 12
    },
    name: name
  };
  return trace;
}
function time_diff(begin_time, end_time){
  diff_ms = end_time - begin_time
  // diff = Math.round(((diff_ms % 86400000) % 3600000) / 60000);
  // time difference in seconds
  diff = diff_ms / 1000;
  // adding one second is nessecary for the blocks given in each level
  return diff + 1;
}

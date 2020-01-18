let workspace;
const internaldelay = 10;
let levelReached = false;

$(document).ready(() => {
  intiBlockls();
  $('#toggleButton').click(() => {
    $('#sidebar').toggleClass('collapsedPhaser');
    $('#content').toggleClass('col-md-11 col-md-5');
    $('#toggleButton').toggleClass('glyphicon-forward glyphicon-backward');
    setTimeout(() => {
      Blockly.svgResize(workspace);
    }, 10);
  });

  function whichTransitionEvent () {
    let t,
        el = document.createElement('fakeelement');

    const transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  const transitionEvent = whichTransitionEvent();

  // $('#sidebar').on(transitionEvent, (event) => {
  // Blockly.svgResize(workspace);
  // });

  const editWorkspace = function (primaryEvent) {
    if (primaryEvent.type !== Blockly.Events.UI) {
      if (levelData[levelSelection].level) {
        $.post('/ctGameStudio/', {
          title: 'change',
          tool: 'Blockly',
          mode: 'tutorial',
          clientTime: new Date(),
          event: JSON.stringify(primaryEvent.toJson()),
          level: levelData[levelSelection].level,
          blockly: Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))

        }, event => {
        });
      }
    }
  };

  workspace.addChangeListener(editWorkspace);
});

function intiBlockls () {
  let wasCoding = true;

  $('#runButton').click(() => {
    if (wasCoding || levelReached) {
		        $.post('/ctGameStudio/', {
			        title: 'test',
        tool: 'Blockly',
        mode: 'tutorial',
        clientTime: new Date(),
			        event: null,
			        level: levelData[levelSelection].level,
			        blockly: Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
		        }, event => {});

      levelReached = false;
      player.isIdle = true;
      stepCode();
      wasCoding = false;
      $('#runButton').text('Neustart');
    } else {
      if (game.state.getCurrentState().key == 'play') {
        game.state.restart(true, false);
      }
      latestCode = '';
      myInterpreter = null;
      generateCodeAndLoadIntoInterpreter();
      $('#runButton').text('Ausführen');
      wasCoding = true;
    }
  });
  const options = {
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },

    toolbox: document.getElementById('toolbox'),
    collapse: false,
    comments: false,
    disable: false,
    maxBlocks: Infinity,
    trashcan: true,
    horizontalLayout: false,
    toolboxPosition: 'start',
    css: true,
    media: 'https://blockly-demo.appspot.com/static/media/',
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true

  };
  /* Inject your workspace */

  workspace = Blockly.inject('blocklyDiv', options);
  workspace.addChangeListener(event => {
    if (!(event instanceof Blockly.Events.Ui)) {
      Blockly.Events.disableOrphans(event);

      // Something changed. Parser needs to be reloaded.
      generateCodeAndLoadIntoInterpreter();
    }
  });
}
Robot.prototype.moveUntil = function (eventString) {
  player.isIdle = false;
  const velocityX = Math.cos(this.robot.object.angle * Math.PI / 180) * player.object.body.movementSpeed;
  const velocityY = Math.sin(this.robot.object.angle * Math.PI / 180) * player.object.body.movementSpeed;

  if (eventString == 'hitObstacle') {
    player.hitObstacle = true;
  } else if (eventString == 'hitEnemy') {
    player.hitEnemy = true;
  } else if (eventString == 'hitEdge') {
    player.hitEdge = true;
  } else if (eventString == 'hitBullet') {
    player.hitBullet = true;
  } else if (eventString == 'hitGoal') {
    player.hitGoal = true;
  } else if (eventString == 'hitBomb') {
    player.hitBomb = true;
  } else if (eventString == 'hitWizard') {
    player.hitWizard = true;
  } else if (eventString == 'hitAmmo') {
    player.hitAmmo = true;
  } else {
    nextCommand();

    return;
  }

  // move forwards
  player.forward = true;
  player.object.body.velocity.x = velocityX;
  player.object.body.velocity.y = velocityY;
};
Robot.prototype.goStraightForward = function (velocity) {
  player.isIdle = false;
  if (velocity > player.object.body.movementSpeed) {
    this.robot.object.body.movementSpeedVariable = player.object.body.movementSpeed;
  } else if (velocity < -this.robot.object.body.movementSpeed) {
    this.robot.object.body.movementSpeedVariable = -player.object.body.movementSpeed;
  } else {
    this.robot.object.body.movementSpeedVariable = velocity;
  }
  player.forward = true;
  setTimeout(() => {
    nextCommand();
  }, internaldelay);
};

Robot.prototype.stop = function () {
  player.isIdle = false;
  player.forward = false;
  player.object.body.velocity.x = 0;
  player.object.body.velocity.y = 0;
  nextCommand();
};

Robot.prototype.wait = function (time) {
  player.isIdle = false;
  player.forward = false;
  player.object.body.velocity.x = 0;
  player.object.body.velocity.y = 0;
  game.time.events.add(time * 1000, nextCommand);
};
Robot.prototype.shot = function () {
  player.isIdle = false;
  player.fire();
  setTimeout(() => {
    nextCommand();
  }, internaldelay);
};
Robot.prototype.shieldActive = function (duration) {
  player.isIdle = false;
  player.activateShield(duration);
  nextCommand();
};
Robot.prototype.angleFrom = function (object) {
  createHighlightBlock();
  if (object != null) {
    return (game.physics.arcade.angleBetween(player.robot.object, object) * 180 / Math.PI) * -1;
  }

  return -1;
};
Robot.prototype.typeFrom = function (type, input) {
  createHighlightBlock();
  if (input != null) {
    if (type == 'enemy' && input.key == 'enemy') {
      return true;
    }
    if (type == 'obstacle' && input.key == 'kiste') {
      return true;
    }
    if (type == 'wizard' && input.key == 'wizard') {
      return true;
    }
    if (type == 'ammo' && input.key == 'munition') {
      return true;
    }
    if (type == 'bomb' && input.key == 'bombe') {
      return true;
    }
  } else {
    if (type == 'undefined') {
      return true;
    }

    return false;
  }
};

Robot.prototype.distanceFrom = function (object) {
  createHighlightBlock();
  if (object != null) {
    const temp = game.physics.arcade.distanceBetween(player.robot.object, object);

    if (isNaN(temp)) {
      return -1;
    }

    return temp;
  }

  return -1;
};
Robot.prototype.xFrom = function (object) {
  if (object != null) {
    return object.position.x;
  }

  return -1;
};

Robot.prototype.yFrom = function (object) {
  if (object != null) {
    return object.position.y;
  }

  return -1;
};
Robot.prototype.getterHitEnemy = function () {
  createHighlightBlock();

  return this.robot.getHitEnemy;
};
Robot.prototype.getterHitBullet = function () {
  createHighlightBlock();
  if (this.robot.getHitBullet) {
    game.time.events.add(50, () => {
      this.robot.getHitBullet = false;
    }, this);
  }

  return this.robot.getHitBullet;
};
Robot.prototype.getterHitEdge = function () {
  createHighlightBlock();

  return this.robot.getHitEdge;
};
Robot.prototype.getterHitObstacle = function () {
  createHighlightBlock();

  return this.robot.getHitObstacle;
};
Robot.prototype.getterHitGoal = function () {
  createHighlightBlock();

  return this.robot.getHitGoal;
};
Robot.prototype.getterHitAmmo = function () {
  createHighlightBlock();

  return this.robot.getHitAmmo;
};
Robot.prototype.getterHitBomb = function () {
  createHighlightBlock();

  return this.robot.getHitBomb;
};
Robot.prototype.getterHitWizard = function () {
  createHighlightBlock();

  return this.robot.getHitWizard;
};

Robot.prototype.target = function (x, y) {
  player.isIdle = false;
  const angle = game.physics.arcade.angleToXY(player.object, x, y) * 180 / Math.PI;

  const anglePos = mod(angle, 360);
  const anglePosPlayer = mod(player.object.angle, 360);

  const left = mod(anglePosPlayer - anglePos, 360);
  const right = mod(anglePos - anglePosPlayer, 360);

  if (left < right) {
    player.turn(-1, left);
  } else {
    player.turn(1, right);
  }

  // JavaScript  modulo  funktioniert nicht für negative Zahlen
  function mod (n, m) {
    return ((n % m) + m) % m;
  }
};

Robot.prototype.turnAbs = function (direction, angle) {
  const distance = 100;
  const x = player.robot.object.x + Math.cos(direction * angle * Math.PI / 180) * distance;
  const y = player.robot.object.y + Math.sin(direction * angle * Math.PI / 180) * distance;

  player.target(x, y);
};

Robot.prototype.turn = function (direction, angle) {
  if (angle != 0) {
    const speed = player.object.body.angularSpeed;
    const tweensTime = Math.abs(((angle * direction) % 360) / speed);
    const tween = game.add.tween(player.object).to({ angle: player.object.angle + direction * angle }, tweensTime, Phaser.Easing.Linear.None, false, 0, 0, false).
      start();

    player.isIdle = false;
    tween.onComplete.addOnce(nextCommand);
  } else {
    nextCommand();
  }
};
Robot.prototype.goForward = function (distance) {
  if (distance == 0) {
    nextCommand();

    return;
  } else if (distance < 0) {
    player.object.body.movementSpeedVariable = -player.object.body.movementSpeed;
  } else {
    player.object.body.movementSpeedVariable = player.object.body.movementSpeed;
  }

  const x = Math.cos(this.robot.object.angle * Math.PI / 180) * distance;
  const y = Math.sin(this.robot.object.angle * Math.PI / 180) * distance;
  const targetX = player.object.x + x;
  const targetY = player.object.y + y;

  player.isIdle = false;
  player.robot.moveToTarget = true;
  player.robot.moveToTargetPoint = new Phaser.Point(targetX, targetY);
  player.forward = true;

  // moveTo(player, targetX, targetY, player.object.body.movementSpeed);
};

Robot.prototype.scanRel = function (direction) {
  direction += player.object.angle * -1;

  return player.scan(direction);
};
Robot.prototype.scan = function (direction) {
  direction *= -1;
  player.isIdle = false;

  const playerMoving = player.forward;

  if (playerMoving) {
    stop();
  }

  if (direction < 0) {
    direction += 360;
  }
  const scanIntervall = 10;
  const range = game.width * 2;
  const cural = range * Math.cos(scanIntervall / 2 * Math.PI / 180);
  const deltaX1 = Math.cos((direction + scanIntervall / 2) * Math.PI / 180) * cural;
  const deltaX2 = Math.cos((direction - scanIntervall / 2) * Math.PI / 180) * cural;

  const deltaY1 = Math.sin((direction + scanIntervall / 2) * Math.PI / 180) * cural;
  const deltaY2 = Math.sin((direction - scanIntervall / 2) * Math.PI / 180) * cural;

  const graphics = game.add.graphics(0, 0);

  graphics.beginFill(0x006600, 0.5);
  graphics.lineStyle(2, 0x01de01, 1);

  const x = player.robot.object.x;
  const y = player.robot.object.y;

  graphics.moveTo(x, y);
  graphics.lineTo(x + deltaX1, y + deltaY1);
  graphics.lineTo(x + deltaX2, y + deltaY2);
  graphics.lineTo(x, y);
  graphics.endFill();

  const objectsInside = [];

  if (playState.obstacles != undefined) {
    inside(playState.obstacles);
  }
  if (playState.ammo != undefined) {
    inside(playState.ammo);
  }
  if (playState.bomb != undefined) {
    inside(playState.bomb);
  }
  if (enemysSprites != undefined) {
    inside(enemysSprites);
  }
  if (playState.wizard != undefined) {
    insideOneObject(playState.wizard.object);
  }

  let object = null; // object which should be returned

  if (objectsInside.length > 0) {
    let minDistance = game.physics.arcade.distanceBetween(player.robot.object, objectsInside[0]);

    object = objectsInside[0];
    if (object.key === 'munition' || object.key === 'bombe') {
      object.alpha = 1;
    }
    for (let i = 1; i < objectsInside.length; i++) {
      const distance = game.physics.arcade.distanceBetween(player.robot.object, objectsInside[i]);

      if (distance < minDistance) {
        minDistance = distance;
        object = objectsInside[i];
      }
    }
  }

  game.time.events.add(Phaser.Timer.SECOND * 0.75, () => {
    graphics.clear();
    if (playerMoving) {
      player.forward = true;
    }
    nextCommand();
  }, this);

  return object;

  function inside (objects) {
    for (let i = 0; i < objects.length; i++) {
      insideOneObject(objects.getAt(i));
    }
  }

  function insideOneObject (object) {
    if (!object.alive) {
      return;
    }

    let angleBetweenObjects = game.physics.arcade.angleBetween(player.robot.object, object) * 180 / Math.PI;
    const intersection1 = Phaser.Line.intersectsRectangle(new Phaser.Line(x, y, x + deltaX1, y + deltaY1), object);
    const intersection2 = Phaser.Line.intersectsRectangle(new Phaser.Line(x, y, x + deltaX2, y + deltaY2), object);

    if (angleBetweenObjects < 0) {
      angleBetweenObjects += 360;
    }
    if (angleBetweenObjects <= direction + scanIntervall / 2 && angleBetweenObjects >= direction - scanIntervall / 2) {
      objectsInside.push(object);
    } else if (intersection1 || intersection2) {
      objectsInside.push(object);
    }
  }
};
function getHealth (object) {
  if (object.key != undefined && object.key != null) {
    if (object.key == 'enemy' || object.key == 'robot') {
      return object.health;
    }

    return -1;
  }

  return -1;
}
function createHighlightBlock () {
  player.isIdle = false;
  setTimeout(() => {
    nextCommand();
  }, internaldelay);
}

// veraltet
// function calcDuration(x1, y1, x2, y2, v){
// let dx = x2 - x1;
// let dy = y2 - y1;
// let d = Math.sqrt(dx * dx + dy * dy);
// let t;
// t = 1000 * d / v;
// return t;
// }
// function moveTo(player, x, y, v){
// let t = calcDuration(x, y, player.object.x, player.object.y, v);
// //let tween = game.add.tween(player.object).to({x: x, y: y}, t, Phaser.Easing.Linear.None, false, 0, 0, false).start();
// //tween.onComplete.addOnce(nextCommand);
// //currentTimerMovement = game.time.events.add(t, nextCommand.bind(this, player.object), this);
// game.physics.arcade.moveToXY(player.object, x, y, v);
// currentTimerMovement = setTimeout(stoppen.bind(this, player.object), t);
// function stoppen(){
// stop();
// nextCommand();
// }
// }
function stop () {
  if (player.object.body != undefined) {
    player.object.body.velocity.x = 0;
    player.object.body.velocity.y = 0;
    player.forward = false;
  } else {

  }
}

function nextCommand () {
  // stop();
  player.isIdle = true;

  if (player.object.alive) {
    nextCodeStep();
  }
}

const initApi = function (interpreter, scope) {
  const wrapperFire = function () {
    return interpreter.createPrimitive(player.shot());
  };

  interpreter.setProperty(scope, 'fire', interpreter.createNativeFunction(wrapperFire));

  const wrapperLog = function (string) {
    return interpreter.createPrimitive(console.log(string));
  };

  interpreter.setProperty(scope, 'log', interpreter.createNativeFunction(wrapperLog));

  const wrapperGoForward = function (distance) {
    return interpreter.createPrimitive(player.goForward(distance));
  };

  interpreter.setProperty(scope, 'goForward', interpreter.createNativeFunction(wrapperGoForward));

  const wrapperTurn = function (direction, angle) {
    return interpreter.createPrimitive(player.turn(direction, angle));
  };

  interpreter.setProperty(scope, 'turn', interpreter.createNativeFunction(wrapperTurn));

  const wrapperTurnAbs = function (direction, angle) {
    return interpreter.createPrimitive(player.turnAbs(direction, angle));
  };

  interpreter.setProperty(scope, 'turnAbs', interpreter.createNativeFunction(wrapperTurnAbs));

  const wrapperTarget = function (x, y) {
    return interpreter.createPrimitive(player.target(x, y));
  };

  interpreter.setProperty(scope, 'target', interpreter.createNativeFunction(wrapperTarget));

  const wrapperWait = function (time) {
    return interpreter.createPrimitive(player.wait(time));
  };

  interpreter.setProperty(scope, 'wait', interpreter.createNativeFunction(wrapperWait));

  const wrapperShield = function (duration) {
    return interpreter.createPrimitive(player.shieldActive(duration));
  };

  interpreter.setProperty(scope, 'activateShield', interpreter.createNativeFunction(wrapperShield));

  const wrapperCollect = function () {
    return interpreter.createPrimitive(player.collect());
  };

  interpreter.setProperty(scope, 'collect', interpreter.createNativeFunction(wrapperCollect));

  const wrapperScan = function (angle) {
    return interpreter.createPrimitive(player.scan(angle));
  };

  interpreter.setProperty(scope, 'scan', interpreter.createNativeFunction(wrapperScan));

  const wrapperScanRel = function (angle) {
    return interpreter.createPrimitive(player.scanRel(angle));
  };

  interpreter.setProperty(scope, 'scanRel', interpreter.createNativeFunction(wrapperScanRel));

  const wrapperFrom = function (type, input) {
    return interpreter.createPrimitive(player.typeFrom(type, input));
  };

  interpreter.setProperty(scope, 'typeFrom', interpreter.createNativeFunction(wrapperFrom));

  const wrapperAngleFrom = function (object) {
    return interpreter.createPrimitive(player.angleFrom(object));
  };

  interpreter.setProperty(scope, 'angleFrom', interpreter.createNativeFunction(wrapperAngleFrom));

  const wrapperDistanceFrom = function (object) {
    return interpreter.createPrimitive(player.distanceFrom(object));
  };

  interpreter.setProperty(scope, 'distanceFrom', interpreter.createNativeFunction(wrapperDistanceFrom));

  const wrapperXFrom = function (object) {
    return interpreter.createPrimitive(player.xFrom(object));
  };

  interpreter.setProperty(scope, 'xFrom', interpreter.createNativeFunction(wrapperXFrom));

  const wrapperYFrom = function (object) {
    return interpreter.createPrimitive(player.yFrom(object));
  };

  interpreter.setProperty(scope, 'yFrom', interpreter.createNativeFunction(wrapperYFrom));

  const wrapperMoveUntil = function (eventString) {
    return interpreter.createPrimitive(player.moveUntil(eventString));
  };

  interpreter.setProperty(scope, 'moveUntil', interpreter.createNativeFunction(wrapperMoveUntil));

  const wrapperGoStraightForward = function (velocity) {
    return interpreter.createPrimitive(player.goStraightForward(velocity));
  };

  interpreter.setProperty(scope, 'goStraightForward', interpreter.createNativeFunction(wrapperGoStraightForward));

  const wrapperStop = function () {
    return interpreter.createPrimitive(player.stop());
  };

  interpreter.setProperty(scope, 'stop', interpreter.createNativeFunction(wrapperStop));

  const wrapperGetHitEnemy = function () {
    return interpreter.createPrimitive(player.getterHitEnemy());
  };

  interpreter.setProperty(scope, 'getHitEnemy', interpreter.createNativeFunction(wrapperGetHitEnemy));

  const wrapperGetHitBullet = function () {
    return interpreter.createPrimitive(player.getterHitBullet());
  };

  interpreter.setProperty(scope, 'getHitBullet', interpreter.createNativeFunction(wrapperGetHitBullet));

  const wrapperGetHitEdge = function () {
    return interpreter.createPrimitive(player.getterHitEdge());
  };

  interpreter.setProperty(scope, 'getHitEdge', interpreter.createNativeFunction(wrapperGetHitEdge));

  const wrapperGetHitObstacle = function () {
    return interpreter.createPrimitive(player.getterHitObstacle());
  };

  interpreter.setProperty(scope, 'getHitObstacle', interpreter.createNativeFunction(wrapperGetHitObstacle));

  const wrapperGetHitGoal = function () {
    return interpreter.createPrimitive(player.getterHitGoal());
  };

  interpreter.setProperty(scope, 'getHitGoal', interpreter.createNativeFunction(wrapperGetHitGoal));

  const wrapperGetHitAmmmo = function () {
    return interpreter.createPrimitive(player.getterHitAmmo());
  };

  interpreter.setProperty(scope, 'getHitAmmo', interpreter.createNativeFunction(wrapperGetHitAmmmo));

  const wrapperGetHitBomb = function () {
    return interpreter.createPrimitive(player.getterHitBomb());
  };

  interpreter.setProperty(scope, 'getHitBomb', interpreter.createNativeFunction(wrapperGetHitBomb));

  const wrapperGetHitWizard = function () {
    return interpreter.createPrimitive(player.getterHitWizard());
  };

  interpreter.setProperty(scope, 'getHitWizard', interpreter.createNativeFunction(wrapperGetHitWizard));

  const wrapperGetPlayer = function () {
    return interpreter.createPrimitive(player.object);
  };

  interpreter.setProperty(scope, 'getPlayer', interpreter.createNativeFunction(wrapperGetPlayer));

  const wrapperGetHealth = function (object) {
    return interpreter.createPrimitive(getHealth(object));
  };

  interpreter.setProperty(scope, 'getHealth', interpreter.createNativeFunction(wrapperGetHealth));

  // Add an API function for highlighting blocks.
  const wrapper = function (id) {
    id = id ? id.toString() : '';

    return interpreter.createPrimitive(highlightBlock(id));
  };

  interpreter.setProperty(scope, 'highlightBlock',
    interpreter.createNativeFunction(wrapper));
};

function highlightBlock (id) {
  workspace.highlightBlock(id);
}

function resetStepUi () {
  workspace.highlightBlock(null);
}

let latestCode = '';

function generateCodeAndLoadIntoInterpreter () {
  // Generate JavaScript code and parse it.
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  latestCode = Blockly.JavaScript.workspaceToCode(workspace);
  resetStepUi();
}

let myInterpreter = null;

function nextCodeStep () {
  if (!player.isIdle) {
    return;
  }
  try {
    if (!player.object.alive) {
      return;
    }
    var hasMoreCode = myInterpreter.step();

    if (hasMoreCode) {
      nextCodeStep();
    }
  } finally {
    if (!hasMoreCode) {
      // Program complete, no more code to execute.
      myInterpreter = null;
      resetStepUi();

      return;
    }
  }
}
function stepCode () {
  if (!myInterpreter) {
    myInterpreter = new Interpreter(latestCode, initApi);
    console.log(`${'Ready to execute the following code\n' + '===================================\n'}${latestCode}`);

    stepCode();

    return;
  }
  nextCodeStep();
}

function clearWorkspace () {
  player.isIdle = true;
  workspace.clear();
  latestCode = '';
  myInterpreter = null;
  levelReached = true;
  $('#runButton').text('Ausführen');
}

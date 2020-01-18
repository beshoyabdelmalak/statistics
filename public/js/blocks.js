$(document).ready(() => {
  Blockly.Blocks.log = {
    init () {
      this.appendValueInput('NAME').
        setCheck(null).
        appendField('Ausgabe');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(250);
      this.setTooltip('Gibt den Parameter in der Konsole aus');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.log = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `log(${value_name});\n`;

    return code;
  };
  Blockly.Blocks.getangle = {
    init () {
      this.appendValueInput('NAME').
        setCheck('objekt').
        appendField('Winkel zu');
      this.setOutput(true, 'Number');
      this.setColour(0);
      this.setTooltip('Gibt den Winkel zwischen Spieler und einem Objekt zurück, abhängig von der Ursprungsrichtung und nicht der Blickrichtung');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.getangle = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `angleFrom(${value_name})`;

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };

  Blockly.Blocks.gety = {
    init () {
      this.appendValueInput('NAME').
        setCheck('objekt').
        appendField('Y-Koordinate');
      this.setOutput(true, 'Number');
      this.setColour(0);
      this.setTooltip('Gibt die Y-Koordinate eines Objektes zurück');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.gety = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `yFrom(${value_name})`;

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };

  Blockly.Blocks.getx = {
    init () {
      this.appendValueInput('NAME').
        setCheck('objekt').
        appendField('X-Koordinate');
      this.setOutput(true, 'Number');
      this.setColour(0);
      this.setTooltip('Gibt die X-Koordinate eines Objektes zurück');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.getx = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_FUNCTION_CALL);
    const code = `xFrom(${value_name})`;

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };

  Blockly.Blocks.distance = {
    init () {
      this.appendValueInput('NAME').
        setCheck('objekt').
        appendField('Abstand');
      this.setOutput(true, 'Number');
      this.setColour(0);
      this.setTooltip('Gibt den Abstand zu einem Objekt zurück');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.distance = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `distanceFrom(${value_name})`;

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };

  Blockly.Blocks.block_gethealth = {
    init () {
      this.appendValueInput('NAME').
        setCheck('objekt').
        appendField('Powerstand von');
      this.setOutput(true, 'Number');
      this.setColour(70);
      this.setTooltip('Gibt die Lebenskraft eines Objektes zurück');
      this.setHelpUrl('');
    }
  };

  Blockly.JavaScript.block_gethealth = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `getHealth(${value_name})`;

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };

  Blockly.Blocks.block_scannummer = {
    init () {
      this.appendValueInput('Name').
        setCheck('Number').
        appendField('scannen aus Ursprungsrichtung');
      this.setOutput(true, '');
      this.setColour(0);
      this.setTooltip('Braucht einen Winkel. Die Ausrichtung wird ausgehend von der Position nach rechts bestimmt. Gibt das nächste Objekt zurück');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_scannummer = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'Name', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `scan(${value_name})`;

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };
  Blockly.Blocks.block_scannummerrel = {
    init () {
      this.appendValueInput('Name').
        setCheck('Number').
        appendField('scannen aus Blickrichtung');
      this.setOutput(true, '');
      this.setColour(0);
      this.setTooltip('Braucht einen Winkel. Die Ausrichtung wird ausgehend von der Blickrichtung bestimmt. Gibt das nächste Objekt zurück');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_scannummerrel = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'Name', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `scanRel(${value_name})`;

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };

  Blockly.Blocks.block_istype = {
    init () {
      this.appendValueInput('is').
        setCheck('objekt').
        appendField('ist Typ').
        appendField(new Blockly.FieldDropdown([[ 'Optionen', 'OPTIONNAME' ], [ 'Gegner', 'enemy' ], [ 'Hindernis', 'obstacle' ], [ 'Mentor', 'wizard' ], [ 'Munition', 'ammo' ], [ 'Bombe', 'bomb' ], [ 'Nichts', 'undefined' ]]), 'NAME');
      this.setOutput(true, 'Boolean');
      this.setColour(0);
      this.setTooltip('Prüft, ob angehängtes Objekt vom ausgewählten Typ ist');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_istype = function (block) {
    const dropdown_name = block.getFieldValue('NAME');
    const value_is = Blockly.JavaScript.valueToCode(block, 'is', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `typeFrom("${dropdown_name}",${value_is})\n`;

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };

  Blockly.Blocks.block_getplayer = {
    init () {
      this.appendDummyInput().
        appendField('Spieler');
      this.setOutput(true, 'objekt');
      this.setColour(70);
      this.setTooltip('Hier kannst du Informationen über dich selbst abfragen');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_getplayer = function (block) {
    const code = 'getPlayer()';

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };

  Blockly.Blocks.flag = {
    init () {
      this.appendDummyInput().
        appendField('Flag:').
        appendField(new Blockly.FieldDropdown([[ 'auf Wand getroffen', 'edge' ], [ 'auf Ziel getroffen', 'goal' ], [ 'auf Gegner getroffen', 'enemy' ], [ 'wurde getroffen', 'bullet' ], [ 'auf Hindernis getroffen', 'obstacle' ], [ 'auf Munition getroffen', 'ammo' ], [ 'auf Bombe getroffen', 'bomb' ], [ 'auf Mentor getroffen', 'wizard' ]]), 'NAME');
      this.setOutput(true, 'Boolean');
      this.setColour(70);
      this.setTooltip('Prüft, ob bestimmte Situation eingetroffen ist');
      this.setHelpUrl('');
    }
  };

  Blockly.JavaScript.flag = function (block) {
    const dropdown_name = block.getFieldValue('NAME');
    let code = '...';

    if (dropdown_name == 'edge') {
      code = 'getHitEdge()';
    } else if (dropdown_name == 'goal') {
      code = 'getHitGoal()';
    } else if (dropdown_name == 'enemy') {
      code = 'getHitEnemy()';
    } else if (dropdown_name == 'bullet') {
      code = 'getHitBullet()';
    } else if (dropdown_name == 'obstacle') {
      code = 'getHitObstacle()';
    } else if (dropdown_name == 'ammo') {
      code = 'getHitAmmo()';
    } else if (dropdown_name == 'bomb') {
      code = 'getHitBomb()';
    } else if (dropdown_name == 'wizard') {
      code = 'getHitWizard()';
    }

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };

  Blockly.Blocks.move_Until = {
    init () {
      this.appendValueInput('Event').
        setCheck('moveEvent').
        appendField('bewegen bis');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(215);
      this.setTooltip('Roboter bewegt sich bis Abbruchbedingung eintrifft');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.move_Until = function (block) {
    const value_Event = Blockly.JavaScript.valueToCode(block, 'Event', Blockly.JavaScript.ORDER_ATOMIC);
    let code;

    if (value_Event == '...') {
      code = ';';
    } else {
      code = `moveUntil(${value_Event});` + `\n`;
    }

    return code;
  };

  Blockly.Blocks['schießen'] = {
    init () {
      this.appendDummyInput().
        setAlign(Blockly.ALIGN_CENTRE).
        appendField('schießen');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(250);
      this.setTooltip('Einzelner Schuss wird abgefeuert');
      this.setHelpUrl('');
    }
  };

  Blockly.JavaScript['schießen'] = function (block) {
    const code = 'fire();\n';

    return code;
  };

  Blockly.Blocks.block_schutzschild = {
    init () {
      this.appendDummyInput().
        appendField('Schutzschild aktivieren').
        appendField(new Blockly.FieldNumber(0, 0, 5), 'Stabilität');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(250);
      this.setTooltip('Aktiviert das Schutzschild des Roboters für bis zu 5 Sekunden. Nicht  direkt zweimal hintereinander verwendbar');
      this.setHelpUrl('');
    }
  };

  Blockly.JavaScript.block_schutzschild = function (block) {
    const number_stabilit_t = block.getFieldValue('Stabilität');
    const code = `activateShield(${number_stabilit_t});\n`;

    return code;
  };

  Blockly.Blocks.collect = {
    init () {
      this.appendDummyInput().
        setAlign(Blockly.ALIGN_CENTRE).
        appendField('einsammeln');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(250);
      this.setTooltip('Jeweiliges Objekt wird eingesammelt');
      this.setHelpUrl('');
    }
  };

  Blockly.JavaScript.collect = function (block) {
    const code = 'collect();\n';

    return code;
  };

  Blockly.Blocks.block_vorwaerts = {
    init () {
      this.appendValueInput('distance').
        setCheck('Number').
        appendField('vorwärts');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(215);
      this.setTooltip('Roboter bewegt sich gegebene Anzahl an Einheiten nach vorne');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_vorwaerts = function (block) {
    const distance = Blockly.JavaScript.valueToCode(block, 'distance', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `goForward(${distance})` + `;\n`;

    return code;
  };

  Blockly.JavaScript.geschwindigkeit = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `goStraightForward(${value_name})` + `;\n`;

    return code;
  };

  Blockly.Blocks.geschwindigkeit = {
    init () {
      this.appendValueInput('NAME').
        setCheck(null).
        appendField('bewegen mit');
      this.appendDummyInput().
        appendField('px/sek');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(215);
      this.setTooltip('Eine durchgehende Bewegung, die durch ein Hindernis aufgehalten aber nicht beendet wird. Maximaleingabe ist 300');
      this.setHelpUrl('');
    }
  };

  Blockly.Blocks.block_stop = {
    init () {
      this.appendDummyInput().
        setAlign(Blockly.ALIGN_CENTRE).
        appendField('anhalten');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(215);
      this.setTooltip('Roboter bewegt sich nicht mehr');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_stop = function (block) {
    const code = 'stop()' + ';\n';

    return code;
  };

  Blockly.Blocks.block_rueckwaerts = {
    init () {
      this.appendValueInput('distance').
        setCheck('Number').
        appendField('rückwärts');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(215);
      this.setTooltip('Roboter bewegt sich gegebene Anzahl an Einheiten nach hinten');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_rueckwaerts = function (block) {
    const distance = Blockly.JavaScript.valueToCode(block, 'distance', Blockly.JavaScript.ORDER_ATOMIC);
    let code = '';

    if (distance > 0) {
      code = `goForward(-${distance})` + `;\n`;
    } else {
      code = `goForward(${distance * -1})` + `;\n`;
    }

    return code;
  };

  Blockly.Blocks.block_drehenneu = {
    init () {
      this.appendValueInput('NAME').
        setCheck(null).
        appendField('drehen nach').
        appendField(new Blockly.FieldDropdown([[ 'rechts', 'nach rechts drehen' ], [ 'links', 'nach links drehen' ]]), 'Richtung').
        appendField('um');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(215);
      this.setTooltip('Roboter dreht sich um einen bestimmten Winkel in angegebener Richtung');
      this.setHelpUrl('');
    }
  };

  Blockly.JavaScript.block_drehenneu = function (block) {
    const dropdown_richtung = block.getFieldValue('Richtung');
    const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let direction;

    if (dropdown_richtung == 'nach links drehen') {
      direction = -1;
    } else {
      direction = 1;
    }
    const code = `turn(${direction},${value_name});\n`;

    return code;
  };

  Blockly.Blocks.block_anpeilen = {
    init () {
      this.appendDummyInput().
        appendField('peile an');
      this.appendValueInput('X').
        setCheck('Number').
        appendField('x');
      this.appendValueInput('Y').
        setCheck('Number').
        appendField('y');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(215);
      this.setTooltip('Drehung in Richtung des angegebenen Punktes');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_anpeilen = function (block) {
    const value_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
    const value_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `target(${value_x},${value_y});\n`;

    return code;
  };
  Blockly.Blocks.block_drehennummer = {
    init () {
      this.appendValueInput('input').
        setCheck('Number').
        appendField('DrehenUm');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(215);
      this.setTooltip('');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_drehennummer = function (block) {
    const value_input = Blockly.JavaScript.valueToCode(block, 'input', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `turn(1,${value_input});\n`;

    return code;
  };

  Blockly.Blocks.drehenursprung = {
    init () {
      this.appendValueInput('NAME').
        setCheck(null).
        appendField('drehen aus Ursprungsrichtung');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(215);
      this.setTooltip('Drehung um einen bestimmten Winkel ausgehend von der Position nach rechts');
      this.setHelpUrl('');
    }
  };

  Blockly.JavaScript.drehenursprung = function (block) {
    const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `turnAbs(-1,${value_name});\n`;

    return code;
  };

  Blockly.Blocks.block_warten = {
    init () {
      this.appendDummyInput().
        appendField('warten').
        appendField(new Blockly.FieldNumber(0, 0, 10), 'wartezeit');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(250);
      this.setTooltip('Roboter wartet angegebene Zahl an Sekunden');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_warten = function (block) {
    const number_time = block.getFieldValue('wartezeit');
    const code = `wait(${number_time});\n`;

    return code;
  };

  Blockly.Blocks.block_programm = {
    init () {
      this.appendDummyInput().
        appendField('Programm');
      this.appendStatementInput('NAME').
        setCheck(null);
      this.setColour(140);
      this.setTooltip('Enthält Befehle, die abgearbeitet werden');
      this.setHelpUrl('');
    }
  };
  Blockly.JavaScript.block_programm = function (block) {
    const statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
    const code = `${statements_name};\n`;

    return code;
  };

  Blockly.Blocks.eventdropdown3_neu = {
    init () {
      this.appendDummyInput().
        appendField(new Blockly.FieldDropdown([[ 'Wand berührt', 'edge' ], [ 'Ziel berührt', 'goal' ], [ 'Gegner berührt', 'enemy' ], [ 'Geschoss berührt', 'bullet' ], [ 'Hindernis berührt', 'obstacle' ], [ 'Bombe berührt', 'bomb' ], [ 'Munition berührt', 'ammo' ], [ 'Mentor berührt', 'wizard' ]]), 'NAME');
      this.setOutput(true, 'moveEvent');
      this.setColour(70);
      this.setTooltip('Kann an den \'bewegen bis\'-Block angehängt werden');
      this.setHelpUrl('');
    }
  };

  // , ["Munition berührt", "ammo"], ["Bombe berührt", "bomb"]

  Blockly.JavaScript.eventdropdown3_neu = function (block) {
    const dropdown_name = block.getFieldValue('NAME');
    let code = '...';

    if (dropdown_name == 'edge') {
      code = '"hitEdge"';
    } else if (dropdown_name == 'goal') {
      code = '"hitGoal"';
    } else if (dropdown_name == 'enemy') {
      code = '"hitEnemy"';
    } else if (dropdown_name == 'bullet') {
      code = '"hitBullet"';
    } else if (dropdown_name == 'bomb') {
      code = '"hitBomb"';
    } else if (dropdown_name == 'obstacle') {
      code = '"hitObstacle"';
    } else if (dropdown_name == 'wizard') {
      code = '"hitWizard"';
    } else if (dropdown_name == 'ammo') {
      code = '"hitAmmo"';
    }

    return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
  };

  Blockly.Blocks.winkel = {
    init () {
      this.appendDummyInput().
        appendField(new Blockly.FieldAngle(90), 'NAME');
      this.setOutput(true, null);
      this.setColour(175);
      this.setTooltip('Grad-Angabe für Winkel');
      this.setHelpUrl('');
    }

  };
  Blockly.JavaScript.winkel = function (block) {
    const angle_name = block.getFieldValue('NAME');
    const code = angle_name;

    return [ code, Blockly.JavaScript.ORDER_NONE ];
  };
});

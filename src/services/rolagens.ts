export function rollD20() {
  let min = 1;
  let max = 20;
  let mathLogic = Math.floor(Math.random() * (max - min + 1)) + min;
  return mathLogic
}


export function calculateResult(roll: number, attValue: number, modValue: number) {
  if (roll === 1) {
    return "CRITICO";
  }
  if (roll === 20) {
    return "FALHA CRITICA";
  }

  return roll <= attValue + modValue ? "SUCESSO" : "FALHA"
}

export function getColor(result: string) {
  var color;
  switch (result) {
    case 'SUCESSO':
      color = 0x01cbf3;
      break;
    case 'CRITICO':
      color = 0x00ff51;
      break;
    case 'FALHA':
      color = 0xf30135;
      break;
    case 'FALHA CRITICA':
      color = 0x000000;
      break;
    default:
      color = 0xffffff;
  }
  return color;

}

function formatRollMessage(charName:string, attName:string, roll:string, result:string, attValue:string, modValue:string, color:string) {
  var dificuldade = attValue + modValue;
  var title = "**" + result + "** " + charName + " rolou " + attName + ": " + roll;
  var description = attName + ": " + attValue + "\nModificador: " + modValue + "\n**Dificuldade total: " + dificuldade + "**";

  var message = {
    "content": "",
    "tts": false,
    "embeds": [
      {
        "type": "rich",
        "title": title,
        "description": description,
        "color": color
      }
    ]
  }
  return message;
}

function formatAtkMessage(charName: string, attName:string, roll:string, attValue:string, modValue:string) {

  var atkTotal = attValue + modValue + roll;
  var title = charName + " atacou! " + attName + ": **" + atkTotal + "**  "
  var description = attName + ": " + attValue +
    "\nModificador: " + modValue +
    "\nRolagem: " + roll +
    "\nAtaque total: **" + atkTotal + "**";
  var message = {
    "content": "",
    "tts": false,
    "embeds": [
      {
        "type": "rich",
        "title": title,
        "description": description,
        "color": 0xffffff
      }
    ]
  }
  return message;
}

function rollAtt(attName:string, attValue:string, modValue:string) {
  var roll = rollD20();
  var result = calculateResult(roll, attValue, modValue);

  var color = getColor(result);

}

function atkAtt(attName:string, attValue:string, modValue:string){
    var roll = rollD20();


}
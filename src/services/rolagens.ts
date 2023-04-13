

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
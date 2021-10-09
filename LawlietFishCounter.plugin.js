/**
 * @name LawlietFishCounter
 * @version 0.0.1
 * @author Creepler13
 * @description Just a simple description of the content that may
 * end up being pretty long
 */

module.exports = class LawlietFishCounter {
  load() {} // Optional function. Called when the plugin is loaded in to memory

  start() {
    /* let divs = document
    .getElementsByTagName("div")

    for (let index = 0; index < divs.length; index++) {
        const element = divs[index];
        if(element.className.startsWith("base")){
         observer.observe(element.children[0],{attributes:true})
         
        }
    }
*/
  } // Required function. Called when the plugin is activated (including after reloads)
  stop() {} // Required function. Called when the plugin is deactivated

  observer(changes) {
    if (changes.type != "childList") return;
    if (changes.addedNodes.length <= 0) return;
    if (!changes.addedNodes[0].className) return;
    if (
      !changes.addedNodes[0].className.toString().startsWith("messageListItem")
    )
      return;

    parseMessage(changes);
  }
};

function parseMessage(changes) {
  let msg = { element: changes.addedNodes[0] };
  let spans = changes.addedNodes[0].getElementsByTagName("span");
  for (let index = 0; index < spans.length; index++) {
    let span = spans[index];

    if (span.className.startsWith("username")) {
      msg.author = span.textContent;
    }
  }

  onMessage(msg);
}

function countFish(message) {
  let spans = message.element.getElementsByTagName("span");

  let emojis = {};

  for (let index = 0; index < spans.length; index++) {
    let span = spans[index];
    if (span.className.startsWith("emojiContainer")) {
      let emoji = span.getElementsByTagName("img")[0].alt;

      if (emoji == ":growth:") break;

      if (!emojis[emoji]) emojis[emoji] = 0;

      emojis[emoji]++;
    }
  }

  return emojis;
}

function onMessage(message) {
  let emojis = countFish(message);

  if (emojis["💼"]) {
    let field = message.element.getElementsByTagName("strong")[0].parentElement;

    let searchedFish = field.getElementsByTagName("img")[0].alt;

    field.textContent =
      field.textContent +
      " " +
      searchedFish +
      " = " +
      (emojis[searchedFish] - 1);
  }
}

/**
 * @name LawlietFishCounter
 * @author Creepler13
 * @description Counts the Fish for Lawliet Work
 * @updateUrl https://raw.githubusercontent.com/Creepler13/LawlietFishCounter/main/LawlietFishCounter.plugin.js
 * @source https://github.com/Creepler13/LawlietFishCounter
 * @authorLink https://github.com/Creepler13
 * @authorId 264027550240604161
 */

 module.exports = class LawlietFishCounter {
  load() {
    require("request").get(
      "https://raw.githubusercontent.com/Creepler13/LawlietFishCounter/main/LawlietFishCounter.plugin.js",
      (e, r, body) => {
        if (!e && body && r.statusCode == 200) {
          let newVersion = (
            body.match(
              /@version ([0-9]+\.[0-9]+\.[0-9]+)|['"]([0-9]+\.[0-9]+\.[0-9]+)['"]/i
            ) || []
          ).filter((n) => n)[1];
          if (this.getVersion() != newVersion)
            BdApi.showConfirmationModal(
              "Newer version found",
              `LawlietFishCounter found a newer version. Please click "Download Now" to install it.`,
              {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onCancel: () => {},
                onConfirm: ()=>update(body),
              }
            );
        }
      }
    );
  }

  getVersion() {
    return "0.1.5";
  }

  start() {}
  stop() {}

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

function update(update) {
  require("fs").writeFile(
    require("path").join(BdApi.Plugins.folder, "LawlietFishCounter.plugin.js"),
    update,
    (_) => BdApi.showToast("Finished downloading Update", { type: "success" })
  );
}

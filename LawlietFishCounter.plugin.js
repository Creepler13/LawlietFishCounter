/**
 * @name LawlietFishCounter
 * @author Creepler13
 * @description Counts the Fish for Lawliet
 * @updateUrl https://raw.githubusercontent.com/Creepler13/LawlietFishCounter/main/LawlietFishCounter.plugin.js
 * @source https://github.com/Creepler13/LawlietFishCounter
 * @authorLink https://github.com/Creepler13
 * @authorId 264027550240604161
 * @version 0.2.11
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
              "LawlietFishCounter - Newer version found",
              "LawlietFishCounter found a newer version (" +
                newVersion +
                "). Please click Download Now to install it.",
              {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onCancel: () => {},
                onConfirm: () => {
                  require("fs").writeFile(
                    require("path").join(
                      BdApi.Plugins.folder,
                      "LawlietFishCounter.plugin.js"
                    ),
                    body,
                    (_) =>
                      BdApi.showToast(
                        "Finished downloading Update " + newVersion,
                        {
                          type: "success",
                        }
                      )
                  );
                },
              }
            );
        }
      }
    );
  }

  onSwitch() {
    updateMessages();
  }

  getVersion() {
    return "0.2.11";
  }

  start() {}
  stop() {}
};

function parseMessage(element) {
  let msg = { element: element };
  let spans = element.getElementsByTagName("span");
  for (let index = 0; index < spans.length; index++) {
    let span = spans[index];

    if (span.className.startsWith("username")) {
      msg.author = span.textContent;
    }
  }

  let divs = element.getElementsByTagName("div");
  for (let index = 0; index < divs.length; index++) {
    let div = divs[index];

    if (div.className.startsWith("embedTitle")) {
      msg.embedTitle = div.textContent.trim();
    }

    if (div.className.startsWith("embedDescription") && !msg.embedDescription) {
      msg.embedDescription = div;
    }
  }

  onMessage(msg);
}

function countFish(message) {
  let imgs = message.embedDescription.getElementsByTagName("img");

  let emojis = { total: 0, specific: {} };

  for (let index = 0; index < imgs.length; index++) {
    let img = imgs[index];

    let emoji = img.alt;

    if (emoji == ":growth:") break;

    if (!emojis.specific[emoji]) emojis.specific[emoji] = 0;

    emojis.specific[emoji]++;
    emojis.total++;
  }

  return emojis;
}

function onMessage(message) {
  if (message.author != "L" || message.embedTitle != "Arbeit") return;
  console.log(message.embedTitle);
  let emojis = countFish(message);
  if (emojis.total == 0) return;

  message.embedDescription.textContent = "";
  for (const key in emojis.specific) {
    message.embedDescription.textContent =
      message.embedDescription.textContent +
      "\n" +
      key +
      " = " +
      emojis.specific[key];
  }

  message.element.counted = true;
}

function updateMessages() {
  let ol = document.getElementsByTagName("ol");

  if (ol.length == 0) return;

  let messages = ol[0].getElementsByTagName("li");

  observer.disconnect();
  observer.observe(ol[0], { childList: true });

  for (let index = 0; index < messages.length; index++) {
    const element = messages[index];
    if (!element.counted) parseMessage(element);
  }
}

const observer = new MutationObserver((list) => {
  updateMessages();
});

function getDiv(id : string) : void {

  // ========= Initialize hashmap here for now ==============
  let blacklist = new Map<string, boolean>()
  blacklist.set("www.chegg.com", false)
  blacklist.set("homework.study.com", false)
  blacklist.set("www.numerade.com", false)
  // ========================================================

  let targetBox = document.getElementById(id)

  let links 
  if (targetBox != null) links = targetBox.querySelectorAll(".yuRUbf")
  else throw "Error"
  links = Array.from(links)
  let index : number = links.length - 1;

  let regExp = /\/[//]([^/]+)\//

  while (index >= 0) {
    let fullUrl = links[index].getElementsByTagName("a")[0].getAttribute("href");
    let base : RegExpExecArray | string | null = null
    if (typeof fullUrl == 'string' ) base = regExp.exec(fullUrl);
    if (base != null) base = base[1];
    if (typeof base == 'string') {
      if (!blacklist.has(base)) {
        links.splice(index, 1);
      } 
    }
    index -= 1;
  }
  index = 0
  while (index < links.length) {
    let display = links[index].getElementsByTagName("h3")[0];
    display.innerHTML = "[" + String.fromCodePoint(0x2718) +"] " + display.innerHTML;
    display.style.color = "red"
    index += 1;
  }

  return  
}

chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id ? tab.id : -1},
    func: getDiv,
    args: ["search"]
  }).then();
});

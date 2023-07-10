// TODO:
// Make script run everytime the user makes a search (requires manifest.json file too):
// https://stackoverflow.com/questions/15149322/executing-chrome-extension-onclick-instead-of-page-load

function getDiv(id : string) : void {

  // ========= Initialize hashmap here for now ==============
  let blacklist = new Map<string, boolean>()
  // true = hard paywall (unimplemented as of now)
  // false = soft paywall (unimplemented)

  // Academic Help
  blacklist.set("www.chegg.com", true)
  blacklist.set("homework.study.com", true)
  blacklist.set("www.numerade.com", true)
  blacklist.set("www.coursehero.com", true)
  blacklist.set("brainly.com", true)
  // News
  blacklist.set("www.wsj.com", true)
  blacklist.set("www.thetimes.co.uk", true)
  blacklist.set("www.thesundaytimes.co.uk", true)
  blacklist.set("www.kyivpost.com", true)
  blacklist.set("www.latimes.com", false)
  blacklist.set("www.washingtonpost.com", false)
  blacklist.set("www.washingtontimes.com", false)
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
    if (typeof base != 'string' || !blacklist.has(base)) {
      index -= 1;
      continue    
    }
    let hard = blacklist.get(base) ? true : false
    let display = links[index].getElementsByTagName("h3")[0];

    if (hard) {
      display.innerHTML = "[" + String.fromCodePoint(0x2718) + "] " + display.innerHTML;
      display.style.color = "#d11919"
    } else {
      display.innerHTML = "[" + String.fromCodePoint(0x2757) + "] " + display.innerHTML;
      display.style.color = "#a6ab1f"
    }     

    index -= 1;
  }

  return  
}

const filter = {
  urls: ["https://www.google.com/search"]
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url) return;
  if (tab.url.includes('https://www.google.com/search'))
  chrome.scripting.executeScript({
    target: {tabId: tab.id ? tab.id : -1},
    func: getDiv,
    args: ["search"]
  }).then();
});

//chrome.tabs.query({
//  "active": true,
//}, function (tabs : chrome.tabs.Tab[]) {
//  console.log("running")
//  for (let tab in tabs) {
//    let url = tabs[tab].url
//    let tabid = tabs[tab].id ? tabs[tab].id : -1
//    if (!(tabid && url)) continue
//      console.log("passed checks")
//
//  }
//})

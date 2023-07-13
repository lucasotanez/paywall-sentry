var cached : boolean = false;

interface styleConfig {
  hard : string;
  soft : string;
  tag : string;
}

const style : styleConfig = {
  hard : "#d11919",
  soft : "#a6ab1f",
  tag: "ps-marked"
}

interface urlListObject {
  [key: string] : boolean
}

let paywallList : urlListObject = {}
fetch("./blacklist.json").then( (data) => data.json() )
.then( (data) => { 
  console.log("cached blacklist data")
  chrome.storage.local.get({ subscriptions: [] }).then( (result) => {
    let userSubs = result.subscriptions;
    for (let sub in userSubs) {
      delete data[userSubs[sub]]
    }
    paywallList = data;
    console.log("user subscriptions loaded")
    cached = true;
  })
})

function sentry(style : styleConfig, blacklistJSON : string) : Element[] {

  let blacklist : Map<string, boolean> = new Map(Object.entries(JSON.parse(blacklistJSON)))

  let targetBox = document.getElementById("search")
  let bottomBox = document.getElementById("botstuff")
  if (targetBox == null || bottomBox == null) throw new Error('Page does not contain results');

  function renderSentryResults( links : Element[], blacklist : Map<string, boolean>, 
                               style : styleConfig ) : void {
    let index : number = links.length - 1;
    let regExp = /\/[//]([^/]+)\//

    while (index >= 0) {
      // get the href of the search result entry
      let fullUrl = links[index].getElementsByTagName("a")[0].getAttribute("href");

      // get the search result entry heading (blue display title)
      let display = links[index].getElementsByTagName("h3")[0];
      if (links[index].classList.contains(style.tag)) {
        index -=1;
        continue;
      }

      // turn the full url into the base url (i.e www.google.com)
      let base : RegExpExecArray | string | null = null
      if (typeof fullUrl == 'string' ) base = regExp.exec(fullUrl);
      if (base != null) base = base[1];

      // search hashmap for the base url
      if (typeof base != 'string' || !blacklist.has(base)) {
        index -= 1;
        continue    
      }

      // if here, then the url is paywalled
      // check if url is soft or hard paywall
      let hard = blacklist.get(base) ? true : false
      if (hard) {
        display.innerHTML = "[" + String.fromCodePoint(0x2718) + "] " + display.innerHTML;
        display.style.color = style.hard 
      } else {
        display.innerHTML = "[" + String.fromCodePoint(0x2757) + "] " + display.innerHTML;
        display.style.color = style.soft
      }     

      // mark each element with a class
      links[index].classList.add(style.tag)

      index -= 1;
    }
    return
  }

  function logChange(records : any, observer: any) {
    let loadedLinks : Element[] = []
    for (const record of records) {
      loadedLinks = loadedLinks.concat(Array.from(record.target.querySelectorAll(".yuRUbf")))
    }
    renderSentryResults(loadedLinks, blacklist, style)
  }

  const observer = new MutationObserver(logChange) 
  observer.observe(bottomBox, { childList: true, subtree: true })

  let linksTop = Array.from(targetBox.querySelectorAll(".yuRUbf"))
  let linksBottom = Array.from(bottomBox.querySelectorAll(".yuRUbf"))
  let links = linksTop.concat(linksBottom)
  renderSentryResults(links, blacklist, style)

  return links
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url || !cached) return;
  if (tab.url.includes('https://www.google.com/search') && changeInfo.status == 'complete'){
    chrome.scripting.executeScript({
      target: {tabId: tab.id ? tab.id : -1},
      func: sentry,
      args: [style, JSON.stringify(paywallList)]
    }).then();
  }
});


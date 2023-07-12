// TODO:
// Make script run everytime the user makes a search (requires manifest.json file too):
// https://stackoverflow.com/questions/15149322/executing-chrome-extension-onclick-instead-of-page-load

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

function sentry(style : styleConfig) : Element[] {

  let blacklist = new Map<string, boolean>()
  // true = hard paywall (unimplemented as of now)
  // false = soft paywall (unimplemented)

  // ========= Initialize hashmap here for now ==============
  blacklist.set("studylib.net", false)

  // Academic Help
  blacklist.set("www.chegg.com", true)
  blacklist.set("homework.study.com", true)
  blacklist.set("www.numerade.com", true)
  blacklist.set("www.coursehero.com", true)
  blacklist.set("brainly.com", false)
  // News
  blacklist.set("www.wsj.com", true)
  blacklist.set("www.thetimes.co.uk", true)
  blacklist.set("www.thesundaytimes.co.uk", true)
  blacklist.set("www.kyivpost.com", true)
  blacklist.set("www.latimes.com", false)
  blacklist.set("www.washingtonpost.com", false)
  blacklist.set("www.washingtontimes.com", false)
  // ========================================================

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
      //for (const addedNode of record.addedNodes) {
        //console.log(addedNode + " type is: " + typeof addedNode)
        loadedLinks = loadedLinks.concat(Array.from(record.target.querySelectorAll(".yuRUbf")))
      //}
    }
    // SOMETHING HERE IS "NOT DEFINED"
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

const filter = {
  urls: ["https://www.google.com/search"]
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url || changeInfo.status != "complete") return;
  console.log(changeInfo.title + " vs " + tab.title)
  if (tab.url.includes('https://www.google.com/search') && changeInfo.status == 'complete'){
    chrome.scripting.executeScript({
      target: {tabId: tab.id ? tab.id : -1},
      func: sentry,
      args: [style]
    }).then( result => console.log(result) );
  }
});




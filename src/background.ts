function getDiv(id : string) : HTMLElement | null{
  let ret = document.getElementById(id)
  console.log(ret)
  return ret
}

chrome.action.onClicked.addListener(async (tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id ? tab.id : -1},
      func: getDiv,
      args: ["search"]
    }).then();
});

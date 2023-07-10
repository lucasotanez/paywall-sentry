const saveSubscription = () => {
  const newUrl = document.getElementById('url').value.trim();
  let subArray = [];
  chrome.storage.local.get({subscriptions: []}).then( (result) => {
    subArray = result.subscriptions
    subArray.push(newUrl)
    chrome.storage.local.set({ subscriptions: subArray }).then( () => { 
      subArray = [newUrl]
      renderSubs(subArray)
    })
  })
};

const renderSaved = () => {
  chrome.storage.local.get({subscriptions: []}).then( (result) => {
    renderSubs(result.subscriptions);
  })
}

const deleteSubscription = (e) => {
  chrome.storage.local.get({ subscriptions: [] }).then( (result) => {
    let updated = result.subscriptions
    for (let i in updated) {
      if (updated[i] === e.target.innerHTML) {
        delete updated[i];
        updated.pop();
        break;
      }
    }
    chrome.storage.local.set({ subscriptions: updated }).then( () => {
      e.target.style.display = "none"
    })
  }) 
}

function renderSubs(content) {
  let box = document.getElementById("displayBox")
  for (let i in content) {
    let newEl = document.createElement("button")
    newEl.innerHTML = content[i] + " " + String.fromCodePoint(0x274C)
    newEl.onclick = deleteSubscription;
    box.appendChild(newEl)
  }
}

document.addEventListener("DOMContentLoaded", renderSaved);
document.getElementById("addUrl").addEventListener("click", saveSubscription)

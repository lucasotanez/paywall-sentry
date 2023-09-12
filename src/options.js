const saveSubscription = () => {
  const newUrl = document.getElementById('url').value.trim();
  if (newUrl == "" || newUrl == null || newUrl == undefined) {
    return;
  }
  chrome.storage.local.get({subscriptions: []}).then( (result) => {
    let subArray = result.subscriptions
    subArray.push(newUrl)
    chrome.storage.local.set({ subscriptions: subArray }).then( () => { 
      subArray = [newUrl]
      renderSubs(subArray)
    })
  })
};

const renderSaved = () => {
  chrome.storage.local.get({subscriptions: []}).then( (result) => {
    if (result.subscriptions != null) renderSubs(result.subscriptions);
  })
  chrome.storage.local.get(["hideAll"]).then( (result) => {
    let state = result.hideAll; 
    if (state == true) {
      document.getElementById('hideAll').checked = true;
    } else {
      document.getElementById('hideAll').checked = false;
    }
  })
  chrome.storage.local.get(["hideHard"]).then( (result) => {
    let state = result.hideHard; 
    if (state == true) {
      document.getElementById('hideHard').checked = true;
    } else {
      document.getElementById('hideHard').checked = false;
    }
  })
}

const deleteSubscription = (e) => {
  chrome.storage.local.get({ subscriptions: [] }).then( (result) => {
    let updated = result.subscriptions
    let baseString = e.target.innerHTML
    baseString = baseString.substring(0, baseString.length - 2).trim()
    for (let i = 0; i < updated.length; i++) {
      if (updated[i] == baseString) {
        if (i == updated.length - 1) {
          updated.pop();
          break;
        } else {
          updated[i] = updated.pop();
          break;
        }
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
    if (i == null) continue;
    let newEl = document.createElement("button")
    newEl.innerHTML = content[i] + " " + String.fromCodePoint(0x274C)
    newEl.onclick = deleteSubscription;
    box.appendChild(newEl)
  }
}

const hideAllResults = (e) => {
  if (e.target.checked) {
    chrome.storage.local.set({ "hideAll": true })
    chrome.storage.local.set({ "hideHard": false })
    document.getElementById('hideHard').checked = false;
  } else {
    chrome.storage.local.set({ "hideAll": false })
  }
}

const hideHardResults = (e) => {
  if (e.target.checked) {
    chrome.storage.local.set({ "hideHard": true })
    chrome.storage.local.set({ "hideAll": false })
    document.getElementById('hideAll').checked = false;
  } else {
    chrome.storage.local.set({ "hideHard": false })
  }
}

const showState = (e) => {
  chrome.storage.local.get(["hideResults"]).then( (result) => {
    if (result.hideResults == true) e.target.style.color = "green"
    else e.target.style.color = "red"
    document.getElementById("show").innerHTML = result.hideResults
  })
}

document.addEventListener("DOMContentLoaded", renderSaved);
document.getElementById("addUrl").addEventListener("click", saveSubscription)
document.getElementById("hideAll").addEventListener("change", hideAllResults)
document.getElementById("hideHard").addEventListener("change", hideHardResults)

document.querySelector('body').style.display = 'flex'
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

const bodies = ["https://classiccachecloudcor.quattroplay.com/bodies/body_castleguard.png", "https://classiccachecloudcor.quattroplay.com/bodies/body_farmer.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody19.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody10.png", "https://classiccachecloudcor.quattroplay.com/bodies/body_shadow.png", "https://classiccachecloudcor.quattroplay.com/bodies/classiciphone_mattbody1.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody15.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody6.png", "https://classiccachecloudcor.quattroplay.com/bodies/classiciphone_mattbody3.png", "https://classiccachecloudcor.quattroplay.com/bodies/dc8bit_body0.png", "https://classiccachecloudcor.quattroplay.com/bodies/rainspearbody-fixed.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody20.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody1.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody2.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody3.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody4.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody5.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody6.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody7.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody8.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody9.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody10.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody11.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody12.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody13.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody14.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody15.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody16.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody17.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody18.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody19.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody20.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody21.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody22.png", "https://classiccachecloudcor.quattroplay.com/bodies/newbody23.png"];

let html_bodies = bodies.map((elem, index) => "\n\n<div style=\"border-radius: 12px; margin: 3px; width: 20%; display: flex; justify-content: center; index=\"" + index + "; cursor: pointer\" onclick=\"set_body_call(" + index + ")\">\n<div  style=\"overflow: hidden; width: 32px; height: 32px; \" class=\"waves-effect waves-light bt\" >\n<img  src=" + elem + " style=\"left: -64px; position: relative\">\n</div>\n</div>\n\n").join("<br>");
async function set_body_call(index) {
  M.toast({
      'html': "set body with id: <b>" + index + "</b>"
  });
  const bodyUrl = bodies[index];
  const bodyName = bodyUrl.split("/").pop();
  await send({"command": "setbody", "params": [bodyName]});
}

document.getElementById("bodys").innerHTML = html_bodies;

const cheats = {
  "admin":[
    {"title":"Show admins","description":"","id":"seeAdmin", "params":[]},
    {"title":"Auto OFF","description":"Disable cheats when admin/player appears","id":"autoOFF", "params":[], "options":[
      {"name":"Admins","checked":true, "id":"autooff-admins"},
      {"name":"Admins and players","id":"autooff-all"}
    ]}
  ],
  "farm":[
    {"title":"Auto farm","description":"Explode all grass in a large area every 2s","id":"autoFarm", "params":[]},
    {"title":"GralatsTp","description":"Teleport to gralats when drop","id":"gralatsTp", "params":[]},
    {"title":"Auto kill hornet","description":"","id":"killHornet", "params":[]}
  ],
  "items":[
    {"title":"Bombs","description":"","id":"infBombs", "params":[]},
    {"title":"Arrows","description":"","id":"infArrows", "params":[]},
    {"title":"Full stamina","description":"Infinite stamina","id":"fullStamina", "params":[]},
  ],
  "others":[
    {"title":"No clip","description":"Remove collisions","id":"noclip", "params":[]},
  ]
};
function getCheatObj(id) {
  for (let category in cheats) {
    for (let item of cheats[category]) {
      if (item.id === id) {
        return item;
      }
    }
  }
  return null;
}

function disableCheat(cheat){
  if (cheat.toLowerCase() == 'all'){
    for (let category in cheats) {
      if (category.toLowerCase() != 'admin'){
      for (let item of cheats[category]) {
        const element = document.getElementById(item.id);
        if (element.classList.contains('selected')) switchBtnClick(element);
      }
    }
    }
  } else {
    const element = document.getElementById(cheat);
    if (element.classList.contains('selected')) switchBtnClick(element);
  } 
}
function recv(data = {}){
  data = typeof data == 'string' ? JSON.parse(data) : data;
  switch (data.message){
    case 'disableCheat':
      for (let param of data.params) {
        disableCheat(param);
      }
      break;
  }
}

async function send(data = {"command":""}) {
   data = typeof data === "string" ? btoa(JSON.stringify({"command":data})) : btoa(JSON.stringify(data))
   url = `http://localhost:3436/${data}`
   const resp = await fetch(url, {
     'method': "GET",
     'mode': "cors",
     'cache': "no-cache",
     'credentials': "same-origin",
     'redirect': "follow",
     'referrerPolicy': "no-referrer",
   });
   return resp.json();
 }
 
 async function send_close() {
  await send('hidemenu');
 }

function switchBtnClick(element){
  const isEnabled = !element.classList.contains('selected')
  if (!isEnabled) element.classList.remove('selected')
  else element.classList.add('selected')
  const cheat = getCheatObj(element.id);
  if (!cheat) return
  send({'command':cheat.id,'params':cheat.params,'state':isEnabled});
}

function optionChange(checkbox) {
  checkbox.checked = true;
  var switchDiv = checkbox.closest('.switch-btn');
  var checkboxes = switchDiv.querySelectorAll('.cheat-option');
  for (cb of checkboxes){
    if (cb !== checkbox) {
      cb.checked = false;
    }
  }
  const isEnabled = switchDiv.classList.contains('selected')
  send({'command':switchDiv.id,'option':checkbox.id, 'state':isEnabled})
}

for (const category in cheats){
  document.getElementById("cheats").innerHTML += `
  <div class="category">
    <b>${category.toUpperCase()}</b>
</div>
  `
  for (const prop of cheats[category]){
    const title = prop.title;
    const description = prop.description;
    const cheatID = prop.id;
    let options = '';
    if ('options' in prop){
      options = "<div style='display:flex; flex-direction: row; gap: 25px;' onclick='event.stopPropagation()'>"
      for (const option of prop.options){
        options += `
        <label>
          <input type="checkbox" class='cheat-option' id="${option.id}" ${option.checked ? "checked='checked'" : ""} onclick="optionChange(this)"/>
          <span>${option.name}</span>
        </label>
        `
      }
      options += '</div>'
    }
    document.getElementById("cheats").innerHTML += `
<div id='${cheatID}' class="switch-btn" onclick="switchBtnClick(this)">
    <span class="switch-title">${title}</span>
    <span class="switch-desc">${description}</span>
    ${options}
</div>
    `
  }
}

function changeLogs(){
  const changeLogsElem = document.querySelector("#changelogs");
  console.log(changeLogsElem)
  console.log(M.Modal.getInstance(changeLogsElem))
  const changeLogsModal = M.Modal.getInstance(changeLogsElem);
  console.log(changeLogsModal)
  changeLogsModal.open();
}
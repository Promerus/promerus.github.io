function atob(input) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = String(input).replace(/=+$/, '');
  let output = '';

  if (str.length % 4 === 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
      let bc = 0, bs, buffer, idx = 0;
      (buffer = str.charAt(idx++));
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
      buffer = chars.indexOf(buffer);
  }
  return output;
}

function getFunc(lib, func, type, params) {
  let _0x270e51 = Module.findExportByName(lib, func);
  return new NativeFunction(_0x270e51, type, params);
}

var malloc = getFunc("libc.so", "malloc", "pointer", ["int"])

function createTString(str) {
  var str_pointer = malloc(4)
  var str_struct = malloc(str.length + 8)
  str_pointer.writePointer(str_struct)
  str_struct.writeInt(str.length)
  ptr(parseInt(str_struct) + 4).writeInt(1)
  ptr(parseInt(str_struct) + 8).writeUtf8String(str)
  return str_pointer

}

function readTString(str) {
  if (!str.isNull()) {
      if (parseInt(str) != 0) {
          var pstr = str.readPointer()
          if (!pstr.isNull()) {
              var strlen = pstr.readInt()
              if (strlen > 0) {
                  var strStart = parseInt(pstr) + 8
                  return ptr(strStart).readCString(strlen)
              }
          }
      }
  }
}
var saveVarsToArray = new NativeFunction(Module.findExportByName("libqplay.so", "_ZN9TGraalVar15saveVarsToArrayEv"), "pointer", ["pointer"]);

function getPlayerProperties(p) {

  let props = {
      "alpha": Memory.readFloat(p.add(0x160)),
      "zoom": Memory.readFloat(p.add(0x138)),
      "x": Memory.readDouble(p.add(0x230)),
      "y": Memory.readDouble(p.add(0x238)),
      "level": readTString(ptr(p.toInt32() + 576))
  }
  return props
}

function getVars(varname, type) {
  let arrayInstance = saveVarsToArray(varname)
  let arrayLen = arrayInstance.add(0x8).readInt()
  let obj = {}
  if (arrayLen > 0) {
      let arrayIterator = arrayInstance.add(0x4).readPointer()
      let str = []
      for (let i = 0; i < arrayLen; i++) {
          str[i] = readTString(arrayIterator.add(i * 0x4).readPointer())
          const [key, value] = str[i].split('=');
          obj[key] = value;
      }
      if (type == "obj") {
          return obj
      } else {
          return str
      }
  }
  return null
}

let cheats = {
  'infBombs': {
    'state':false, 'option': ''
    },
  'infArrows': {
    'state':false, 'option': ''
    },
  'noclip': {
    'state':false, 'option': ''
    },
  'showAdmin': {
    'state':false, 'option': ''
    },
  'fullStamina': {
    'state':false, 'option': ''
    },
  'autoOFF': {
    'state':false, 'option': ''
    },
  'killHornet': {
    'state':false, 'option': ''
    },
  'autoFarm': {
    'state':false, 'option': ''
    },
    'gralatsTp':{
      'state':false, 'option': ''
    }
}
const incomingPackage = new NativeFunction(Module.findExportByName("libqplay.so", "_ZN7TClient22processIncomingPackageEiRK7TString"), "void", ["pointer", "int", "pointer"]);
const getlocaly = new NativeFunction(Module.findExportByName("libqplay.so", "_ZNK7TPlayer9getlocalyEv"), "double", ["pointer"]);
const getlocalx = new NativeFunction(Module.findExportByName("libqplay.so", "_ZNK7TPlayer9getlocalxEv"), "double", ["pointer"]);
const putExplosion = new NativeFunction(Module.findExportByName("libqplay.so", "_ZN12TServerLevel12putExplosionEdddii"), "void", ["pointer", "double", "double", "double", "int", "int"]);
const setVarValue = new NativeFunction(Module.findExportByName("libqplay.so", "_ZN9TGraalVar11setVarValueERK7TString"), "void", ["pointer", "pointer"]);
const getSwordDir = new NativeFunction(Module.findExportByName("libqplay.so", "_ZN13TServerPlayer11getSwordDirEv"), "int", ["pointer"]);
const hitNPC = new NativeFunction(Module.findExportByName("libqplay.so", "_ZN7TPlayer11testNPCHitsEdd"), "void", ["pointer","double","double"]);
const setArrows = new NativeFunction(Module.findExportByName("libqplay.so", "_ZN7TPlayer9setArrowsEi"), "void", ["pointer", "int"])
var setlocalx = new NativeFunction(Module.findExportByName("libqplay.so", "_ZN7TPlayer9setlocalxEdb"), "double", ["pointer","double","bool"]);
var setlocaly = new NativeFunction(Module.findExportByName("libqplay.so", "_ZN7TPlayer9setlocalyEdb"), "double", ["pointer","double","bool"]);
const bombs_99 = createTString("bombs=99");
const stamina = createTString("clientr.stamina=100");
const activeplayer = Module.findExportByName("libqplay.so", "activeplayer").readPointer();
const alpha = createTString('alpha=0.5');
const zoom = createTString('zoom=1')
let canExplode = false;
let tserver_level = false
let hasDisabled = false;
let incomingPackage_instance = false;

function showToast(text, time = 1) {
  Java.perform(() => {
      Java.scheduleOnMainThread(function() {
          var toast = Java.use("android.widget.Toast");
          toast.makeText(Java.use("android.app.ActivityThread").currentApplication().getApplicationContext(), Java.use("java.lang.String").$new(text), time).show();
      });
  });
}

setInterval(()=>{
  canExplode = true;
},2000)

function disableCheats() {
  sendData({
      'message': 'disableCheat',
      'params': ['all']
  })
  for (cheat in cheats) {
      if (cheat.toLowerCase() != 'showadmin' && cheat.toLowerCase() != 'autooff') cheats[cheat] = false;
  }
}
function notification(msg){
    if (!incomingPackage_instance) return
    msg = createTString(`       clientside,-Games,notification,"""${msg}"",5,"""","""","""""`);
    incomingPackage(incomingPackage,48,msg)
  }
Interceptor.attach(Module.findExportByName("libqplay.so", "_ZN12TServerLevel9isOnWaterEdd"), {
  onEnter: function(args) {
      if (!cheats.autoFarm.state || !canExplode) return
      canExplode = false;
      const playerX = getlocalx(activeplayer);
      const playerY = getlocaly(activeplayer);
      for (let i = 0; i < 100; i++){
          for (let j = 0; j < 100; j++){
              putExplosion(tserver_level,playerX+50-i,playerY+50-j,1,0,1)
          }
      }
  }
})
Interceptor.attach(Module.findExportByName("libqplay.so", "_ZN12TServerLevel14addDrawObjectsEP7TPlayer"), {
  onEnter: function(args) {
      tserver_level = args[0]
  }
})


Interceptor.attach(Module.findExportByName("libqplay.so", "_ZN7TClient22processIncomingPackageEiRK7TString"), {
    onEnter: function(args) {
        incomingPackage_instance = args[0]
    }
  })

let playerprops
let gralats = []

let intervalo;
function gralatsTp(){
  if (gralats.length > 0 && cheats.gralatsTp.state) {
        const gprops = gralats.shift();
        playerprops = getPlayerProperties(activeplayer)
        setVarValue(activeplayer,createTString('x='+gprops.x))
        setVarValue(activeplayer,createTString('y='+gprops.y))
        console.log(gralats.length)
    } else {
    }
}
intervalo = setInterval(gralatsTp,1000)
Interceptor.attach(Module.findExportByName("libqplay.so", "_ZN10TServerNPC13setPropertiesERK7TString"), {
  onEnter: function(args) {
      const recv = readTString(args[1])
      if (recv.includes('0classicgralats') && cheats.gralatsTp.state){
        const props = getPlayerProperties(args[0])
        gralats.push(props)
      }
  }, onLeave: function (ret) {

  }
})
Interceptor.attach(Module.findExportByName("libqplay.so", "_ZN7TPlayer9getArrowsEv"), {
  'onEnter': function(args) {
      if (cheats.infArrows.state) setArrows(activeplayer, 99);
  },
  'onLeave': function(ret) {
      if (cheats.fullStamina.state) setVarValue(activeplayer, stamina);
  }
});

Interceptor.attach(Module.findExportByName("libqplay.so", "_ZN12TServerLevel8isOnWallEddb"), {
  'onLeave': function(ret) {
      if (cheats.noclip.state) {
          ret.replace(0);
      }
  }
});

function getVar(varname, name) {
  let arrayInstance = saveVarsToArray(varname)
  let arrayLen = arrayInstance.add(0x8).readInt()

  if (arrayLen > 0) {
      let arrayIterator = arrayInstance.add(0x4).readPointer()

      for (let i = 0; i < arrayLen; i++) {
          let str = readTString(arrayIterator.add(i * 0x4).readPointer())
          if (str.split("=")[0] == name) {
              return str.split("=")[1]
          }
      }

  }
  return null
}
Interceptor.attach(Module.findExportByName("libqplay.so", "_ZN13TServerPlayer13setPropertiesERK7TString"), {
  'onEnter': function(args) {
      const accRgx = /^(pc\:|graal\d+)/;
      const account = getVar(args[0], 'account').toLowerCase()
      if (account == '') return
      const props = getPlayerProperties(args[0]);
      if (props.alpha == 0 && props.zoom == 0 && cheats.showAdmin.state) {
          setVarValue(args[0], alpha);
          setVarValue(args[0], zoom);
      }
      
      if (!accRgx.test(account)) {
          console.log('admin')
          console.log(account)
          if (cheats.autoOFF.state && !hasDisabled) {
              hasDisabled = true
              showToast('Admin '+ account +'. Scripts disabled.')
              disableCheats()
              return
          }
      }
      if (cheats.autoOFF.state && cheats.autoOFF.option == 'autooff-all' && !hasDisabled && args[0].toInt32() != activeplayer.toInt32()) {
        const props2 = getPlayerProperties(activeplayer)
        if (props.level != props2.level) return
        hasDisabled = true
        console.log('player')
        console.log(account)
        showToast('Player '+ account +'. Scripts disabled.')
   //     showToast(JSON.stringify(props),5)
        disableCheats()
        return
    }
  }
});

Interceptor.attach(Module.findExportByName("libqplay.so", "_ZN7TPlayer13getBombsCountEv"), {
  'onEnter': function(args) {
      if (cheats.infBombs.state) setVarValue(args[0], bombs_99);
  },
  'onLeave': function(ret) {
      if (cheats.fullStamina.state) setVarValue(activeplayer, stamina);
  }
});

Interceptor.attach(Module.findExportByName("libqplay.so", "_ZN10TServerNPC10addNPCMoveEdddiddb"), {
  onEnter: function(args) {
      if (cheats.killHornet.state) {
          const ani = getVar(args[0], 'ani')
          if (ani.includes("hornet")) {
              let dir = getSwordDir(activeplayer)
              let npcProps = getPlayerProperties(args[0])
              if (dir == 1) hitNPC(activeplayer, npcProps.x + 2, npcProps.y)
              else if (dir == 3) hitNPC(activeplayer, npcProps.x - 2, npcProps.y)
              else if (dir == 0) hitNPC(activeplayer, npcProps.x, npcProps.y + 2)
              else if (dir == 2) hitNPC(activeplayer, npcProps.x, npcProps.y - 2)
          }
      }
  }
})
const hostconfig = {
  'family': "ipv4",
  'host': "127.0.0.1",
  'port': 3436
};

(async function() {
  let socket;
  console.log(8)
  try {
      console.log("Calling listening..");
      socket = await Socket.listen(hostconfig);
      console.log("Listening");
  } catch (error) {
      console.log(error);
      showToast("This is already running on this device please turn it the other aplication off.\nyou only can use one instance per time.");
      return;
  }
  console.log("SOcket connection created");
  console.log("Listening on: http://localhost:3436");
  while (true) {
      try {
          console.log("Awaiting a new connection..");
          const connection = await socket.accept();
          console.log("New connection accepted");
          console.log("Now calling liestening function..");
          socket_message(connection);
          console.log("Connection handled..");
      } catch (error) {
          console.log(error);
      }
  }
  socket.close();
})();




let menu = null;
let openMenu = false;
const menu_url = 'https://promerus.github.io/menu.html'


function showMenu() {
  Java.perform(function() {
      Java.scheduleOnMainThread(() => {
          console.log('OPEN MENU')

          if (openMenu == false && menu) {
              menu.setVisibility(0);
              menu.requestFocusFromTouch();
          }
          openMenu = true;
      });
  });
}

function hideMenu() {
  Java.perform(function() {
      Java.scheduleOnMainThread(() => {
          if (openMenu && menu) {
              menu.setVisibility(-1);
              menu.clearFocus();
          }
          openMenu = false;
      });
  });
}

Java.perform(function() {
  var gameInstance = Java.use("com.quattroplay.GraalClassic.QPlayActivity");
  gameInstance.onKeyUp.implementation = function(key, code) {
      if (key == 61 || key == 25) {
          showMenu();
      }
      return this.onKeyUp(key, code);
  };
  gameInstance.onKeyDown.implementation = function(key, code) {
      if (menu == null) {
          console.log("onResume foi hookado!");
          var self = this;
          {
              var _0x47c3d6 = Java.use("android.view.WindowManagerImpl");
              var webview = Java.use("android.webkit.WebView");
              var layoutParams = Java.use("android.view.WindowManager$LayoutParams");
              showToast("Gui loaded on memory !")
              var layout = layoutParams.$new();
              layout.width = -1;
              layout.height = -1;
              layout.type = layoutParams.APLICATION;
              layout.flags = layoutParams.FLAG_FULLSCREEN | layoutParams.FLAG_NOT_FOCUSABLE | layoutParams.FLAG_NOT_TOUCH_MODAL | layoutParams.FLAG_NOT_TOUCHABLE;
              var webview = Java.use("android.webkit.WebView");
              menu = webview.$new(self);
              menu.clearCache(true);
              menu.setBackgroundColor(0);
              {
                  menu.setVisibility(-1);
              }
              menu.setWebViewClient(Java.use("android.webkit.WebViewClient").$new());
              menu.getSettings().setJavaScriptEnabled(true);
              menu.loadDataWithBaseURL.overload("java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String", "java.lang.String").call(menu, null, "\n            loading..\n            ", "text/html", "utf-8", null);
              menu.loadUrl(menu_url);
              openMenu = false;
              self.addContentView(menu, layout);
          }
      }
      return this.onKeyDown(key, code);
  };
});

async function socket_message(connection) {
  try {
      console.log("INPUT WAITING");
      const buffer = await connection.input.read(1024);
      const text = Memory.readCString(buffer.unwrap());
      const data = JSON.parse(atob(text.split(' ')[1].replace('/', '')));
      console.log(JSON.stringify(data))
      const command = data.command.toLowerCase();
      console.log(command)
      if (hasDisabled && data.state) hasDisabled = false;
      switch (command) {
          case 'hidemenu':
              hideMenu();
              break
          case 'showmenu':
              showMenu();
              break;
          case 'setbody':
              setVarValue(activeplayer, createTString('body=' + data.params[0]));
              break;
          case 'noclip':
              cheats.noclip.state = data.state;
              break
          case 'infbombs':
              cheats.infBombs.state = data.state;
              break;
          case 'infarrows':
              cheats.infArrows.state = data.state;
              break;
          case 'seeadmin':
              cheats.showAdmin.state = data.state;
              break;
          case 'autooff':
              cheats.autoOFF.state = data.state;
              if ('option' in data) cheats.autoOFF.option = data.option;
              break;
          case 'fullstamina':
              cheats.fullStamina.state = data.state;
              break;
          case 'killhornet':
              cheats.killHornet.state = data.state;
              break;
          case 'autofarm':
              cheats.autoFarm.state = data.state;
              break;
          case 'gralatstp':
              cheats.gralatsTp.state = data.state;
              break
      }
      connection.close();
      if (!command) console.log("text is undefined and cannot be read");
  } catch (error) {
      console.log(error);
  }
}

function sendData(message) {
  console.log(message)
  const data = message === "string" ? message : JSON.stringify(message);
  console.log(data)
  Java.perform(function() {
      Java.scheduleOnMainThread(() => {
          console.log('enviando')
          menu.loadUrl(`javascript:recv(${data});`)
          console.log('enviado')
      })
  })
}

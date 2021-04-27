var ioConnection = null;

function initIoConnection() {
    ioConnection = io("https://enigma.zerody.one");
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}


function getInstanceId() {
    if(localStorage.getItem("instanceId")) return localStorage.getItem("instanceId");
    var newInstanceId = uuidv4();
    localStorage.setItem("instanceId", newInstanceId);

    return newInstanceId;
}

function getWidgetUrl() {
    if(location.host.indexOf(".github.io") >= 0) {
        return location.protocol + '//' + location.host + "/ObsChat/ObsChat/ObsChat.html?instanceId=" + getInstanceId(); 
    } else {
        return location.protocol + '//' + location.host + "/ObsChat/ObsChat.html?instanceId=" + getInstanceId();
    }
}

function pushConfig(config) {
    ioConnection.emit("push", {room: getInstanceId(), event: "updateWidgetConfig", data: config});
}
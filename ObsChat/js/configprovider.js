function initConfigProvider(instanceId, onConfigAvailable) {
    ioConnection = io("https://enigma.zerody.one");

    ioConnection.on("connect", () => {
        ioConnection.emit("join", instanceId);
    });

    ioConnection.on("reconnect", () => {
        ioConnection.emit("join", instanceId);
    });

    ioConnection.on("updateWidgetConfig", (configData) => {
        localStorage.setItem("latestConfigData", JSON.stringify(configData));
        onConfigAvailable(configData);
    });

    // restore latest config from localStorage
    var latestConfigData = localStorage.getItem("latestConfigData");
    if(latestConfigData) onConfigAvailable(JSON.parse(latestConfigData));
}

function getInstanceIdFromUrl() {
    return new URLSearchParams(location.search).get("instanceId");
}

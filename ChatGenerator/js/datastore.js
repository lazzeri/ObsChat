function saveConfigInLocalStorage() {

    // save <input> fields
    $("input").each((counter, input) => {
        console.log(input.getAttribute("type").toLowerCase());

        if(!input.id) {
            console.warn("Found <input> element without unique id. can't save...", input);
            return;
        }

        var storageKey = "input_" + input.getAttribute("type").toLowerCase() + "_" + input.id;
        var storageValue = null;

        switch(input.getAttribute("type").toLowerCase()) {
            case "text":
            case "number":
            case "color":
                storageValue = input.value;
                break;
            case "checkbox":
                storageValue = input.checked;
                break;
            default:
                return;
        }

        localStorage.setItem(storageKey, storageValue);
    });

    // save dropdown menus
    $(".dropdown").each((counter, dropDownMenu) => {
        
        var currentValue = $(dropDownMenu).find("button");
        if(currentValue.length === 0) return;

        if(!currentValue[0].id) {
            console.warn("Found dropdown element without unique id. can't save...", dropDownMenu);
            return;
        }

        var storageKey = "dropdown_" + currentValue[0].id;
        var storageValue = currentValue[0].innerText.trim();

        localStorage.setItem(storageKey, storageValue);
    });
}

function restoreConfigFromLocalStorage() {

    // restore <input> fields
    $("input").each((counter, input) => {

        if(!input.id) return;

        var storageKey = "input_" + input.getAttribute("type").toLowerCase() + "_" + input.id;
        var storageValue = localStorage.getItem(storageKey);

        if(storageValue === null) return;

        switch(input.getAttribute("type").toLowerCase()) {
            case "text":
            case "number":
            case "color":
                input.value = storageValue;
                break;
            case "checkbox":
                input.checked = storageValue === "true";
                break;
            default:
                return;
        }

        // fire onChange event to process the new value by attached listeners
        input.dispatchEvent(new Event("change"));
    });

    // save dropdown menus
    $(".dropdown").each((counter, dropDownMenu) => {
    
        var currentValue = $(dropDownMenu).find("button");
        if(currentValue.length === 0) return;

        if(!currentValue[0].id) {
            console.warn("Found dropdown element without unique id. can't save...", dropDownMenu);
            return;
        }

        var storageKey = "dropdown_" + currentValue[0].id;
        var storageValue = localStorage.getItem(storageKey);

        if(storageValue) {
            var availableOptions = $(dropDownMenu).find(".dropdown-item");
            availableOptions.each((counter, option) => {
                if(option.innerText.trim() === storageValue) {

                    // fire onClick event to process the pre-selected option by attached listeners
                    option.dispatchEvent(new Event("click"));
                }
            })
        }
    });
}
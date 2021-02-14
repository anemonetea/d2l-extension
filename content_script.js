
const dark = "#333333";
const body_bgc = "#424242";
const text_color = "#FAFAFA";
const link_color = "#80D8FF";
const button_primary = "#0091EA";
const button_secondary = text_color;

let discovered_elements = [];
const targetNodes = [];
const discoveredNodes = [];

window.onload = () => {
    console.log("Page reloaded");
    dark_mode()
}

document.addEventListener("keydown", event => {
    if (event.code === "Tab") {
        console.log("Tab key detected");
        console.log("editor element:")
        //console.log(document.getElementsByClassName("d2l-htmleditor")[0]);   // null
        let listOfParagraphs = document.getElementById("tinymce").getElementsByTagName("p");
        let lastParagraph = listOfParagraphs[listOfParagraphs.length-1];
        console.log(lastParagraph);
        console.log(lastParagraph.innerHTML);
        if (lastParagraph.innerHTML !== '<br data-mce-bogus="1">')
            lastParagraph.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;";
        else 
            lastParagraph.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
        lastParagraph.focus();
    }
});

function dark_mode() {
    dfs(document.body, body_bgc, text_color);


    let dropdownContentElements = document.getElementsByTagName("d2l-dropdown-content");
    for (let i = 0; i<dropdownContentElements.length; i++) {
        let elem = dropdownContentElements[i];
        if (!elem.classList.contains("d2l-menuflyout-dropdown-contents")) {
            targetNodes.push(elem);
        }
    }

    // let postReplyTopXPath = document.evaluate("//*[@id='threadContentsPlaceholder']/div/div[2]/div[4]", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    // if (postReplyTopXPath) {
    //     if (postReplyTopXPath.singleNodeValue) {
    //         targetNodes.push(postReplyTopXPath.singleNodeValue);
    //     }
    // }

    // let postReplyBottomXPath = document.evaluate("//*[@id='threadContentsPlaceholder']/div/div[2]/div[6]", document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    // if (postReplyBottomXPath) {
    //     if (postReplyBottomXPath.singleNodeValue) {
    //         targetNodes.push(postReplyBottomXPath.singleNodeValue);
    //     }
    // }

    // Page gets reloaded and then these are null...
    targetNodes.push(document.getElementById('postReplyPlacehodler_top'));
    targetNodes.push(document.getElementById('postReplyPlacehodler_bottom'));

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: false };

    

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    
    targetNodes.forEach((node) => {
        // Start observing the target node for configured mutations
        try {
            observer.observe(node, config);
        } catch (err) {
            console.log(err);
        }
    });
    

    console.log("Number of target nodes:");
    console.log(targetNodes.length);

}

// Callback function to execute when mutations are observed
const callback = function(mutationsList, myobserver) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (mutation.addedNodes.length !== 0) {
                console.log("Added node");
                if (!discoveredNodes.includes(mutation.target)) {
                    dfs(mutation.target, body_bgc, text_color);
                    discoveredNodes.push(mutation.target);
                    // let indexToDelete = targetNodes.indexOf(mutation.target);
                    // if (indexToDelete !== -1) {
                    //     console.log("Index to delete = " + indexToDelete);
                    //     console.log("Target nodes:");
                    //     console.log(targetNodes);
                    //     targetNodes.splice(indexToDelete, 1);
                    // }
                    // if (targetNodes.length === 0) {
                    //     observer.disconnect();
                    // }
                    // if (discoveredNodes.length === targetNodes.length) {
                    //     console.log("Stopping observer");
                    //     observer.disconnect();
                    // }
                }
            }
            if (mutation.removedNodes.length !== 0) {
                console.log("Removed node");
            }
        }
        else if (mutation.type === 'attributes') {
            if (mutation.attributeName === "opened") {
                discoveredNodes.push(mutation.target);
            }
            //console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
}


function dfs(element, backgroundColor, foregroundColor) {
    if (!element || !element.style)
        return;
    discovered_elements.push(element);
    if (element.classList.contains("d2l-link") || element.classList.contains("d2l-button-subtle-icon") 
    || element.classList.contains("d2l-button-subtle-content")) {
        element.style.color = link_color;
    }
    else {
        element.style.color = foregroundColor;
    }
    if (element.classList.contains("d2l-button")) {
        //console.log("Found a button");
        if (element.hasAttribute("primary")) {
            element.style.backgroundColor = button_primary;
        }
        else {
            element.style.backgroundColor = button_secondary;
            element.style.color = body_bgc;
        }
        return;
    }
    else if (element.classList.contains("d2l-htmleditor-group-bordered")) {
        element.style.borderColor = dark;
    }
    else if (element.classList.contains("d2l-htmleditor-button")) {
        element.style.backgroundColor = button_secondary;
        element.style.color = body_bgc;
        return;
    }
    else {
        element.style.backgroundColor = backgroundColor;
    }
    if (element.id === "tinymce") {
        return;
    }
    for (let c of element.children) {
        if (!discovered_elements.includes(c)) {
            dfs(c, backgroundColor, foregroundColor);
        }
    }
    if (element.shadowRoot) {
        for (let shadow_c of element.shadowRoot.children){
            dfs(shadow_c, backgroundColor, foregroundColor);
        }
    }
}

// Original function from: https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists/57395241#57395241
// function waitForElementToDisplay(selectors, callback, checkFrequencyInMs, timeoutInMs) {
//     var startTimeInMs = Date.now();
//     var elem;
//     (function loopSearch() {
//         for (let selector of selectors) {
//             elem = document.querySelector(selector);
//             if (elem != null) {
//                 callback(elem);
//                 let indexToDelete = selectors.indexOf(selector);
//                 selectors.splice(indexToDelete, 1);  // best for memory
//                 //delete selectors[indexToDelete];  // replaces array element with empty
//                 //selectors = selectors.filter(elem => elem !== selector);  // causes memory leak! yikes!
//                 console.log("New selectors:");
//                 console.log(selectors);
//                 if (selectors.length === 0) {
//                     return;
//                 }
//             }
//             else {
//                 setTimeout(function () {
//                 if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
//                     return;
//                 loopSearch();
//                 }, checkFrequencyInMs);
//             }
//         }
//     })();
// }

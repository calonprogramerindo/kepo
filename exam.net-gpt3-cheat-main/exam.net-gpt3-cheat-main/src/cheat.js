/*
  This is free and unencumbered software released into the public domain.
  
  Anyone is free to copy, modify, publish, use, compile, sell, or
  distribute this software, either in source code form or as a compiled
  binary, for any purpose, commercial or non-commercial, and by any
  means.
  
  In jurisdictions that recognize copyright laws, the author or authors
  of this software dedicate any and all copyright interest in the
  software to the public domain. We make this dedication for the benefit
  of the public at large and to the detriment of our heirs and
  successors. We intend this dedication to be an overt act of
  relinquishment in perpetuity of all present and future rights to this
  software under copyright law.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
  OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
  ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
*/

// For the killswitch, will be implemented later
var kill = false;
var running = false;
// Every char that can be used in the request
var let_num = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö0123456789,.!_§¶/+*- ";
// The question
var string = "";
// The string with the reply
var response_string = "";
var old_title = document.title;

// Replace 'YOUR_API_KEY' with your actual API key from your GPT premium account
var apiKey = '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';

function make_request(input) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.openai.com/v1/completions");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    var requestData = {
        "model": "gpt-4",  // Use GPT-4 model
        "prompt": input,
        "max_tokens": 100,
        "temperature": 0
    };
    var requestBody = JSON.stringify(requestData);
    xhr.send(requestBody);
    xhr.onload = function() {
        if (xhr.status == 200) {
            // Successful request
            var responseData = JSON.parse(xhr.responseText);
            // Do something with the response data
            response_string = responseData.choices[0].text;

        } else {
            // Request failed
            console.error("Error: " + xhr.statusText);
            response_string = xhr.statusText;
            response_string = "";
        }
    };
}


function KeyPress(e) {
    var evtobj = window.event? event : e;
    // ctrl + shift
    if (!kill && evtobj.keyCode == 16 && evtobj.ctrlKey) {
        // start
        response_string = "";
        running = true;
    }

    if (evtobj.keyCode == 18 && evtobj.ctrlKey) {
        // stop
        running = false;
        // Send request if string is not empty
        if (string.length > 1) {
            make_request(string);
            // clear string after request is done
            string = "";
        }
        // restore original title
        document.title = old_title;
    }

    // backspace
    if (evtobj.keyCode == 8 && string.length != 0) {
        string = string.slice(0, -1);
    }
}

document.onkeydown = KeyPress;

window.onclick = e => {
    // Handle the response in input or textarea elements
    console.log(e.target.tagName);
    if ((e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") && response_string != "") {
        e.target.value = e.target.value + response_string;
    } else if (response_string != "") {
        e.target.childNodes[0].innerText = e.target.childNodes[0].innerText + response_string;
        console.log(e.target.childNodes[0].innerText);
    }
}

document.addEventListener("keydown", function(event) {
    // ⬞ in tab title means it's recording keys
    if (running) {
        if (let_num.includes(event.key)) {
            string += event.key;
        }
        if (string.length != 0 && !kill) {
            document.title = "⬞" + string;
        } else if (!kill) {
            document.title = "⬞" + old_title;
        } else {
            document.title = old_title;
        }
    }
});

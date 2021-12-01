// the api url to send requests
const url = "https://api.genderize.io/"
var serverOutput;
// shows appropriate error message on the web page using a <p> tag
function showError(errorContent) {
    console.log("Show error")
    let textareaObject = document.getElementById("error");
    textareaObject.innerHTML = errorContent;
    setTimeout(() => { // removes the error message from screen after 4 seconds.
        textareaObject.innerHTML = ""
    }, 4000)

}

// get data from API and return the json value.
async function getGenderFromAPI(name) {
    console.log("request");
    try {
        console.log(url+"?name="+name)
        let response = await fetch(url+"?name="+name)
        let json = await response.json();
        if (response.status == 200) {
            if (json.gender == null){
                console.log("Name not found")
                showError("Name not found on server")
                return json
            }
            return json
        }
        console.log("Error")
        showError(`Request failed with error ${response.status}`)
    } catch (e) {
        console.log(e);
        showError("Unknown Error")
    }
}

// clears the output section on web page and reads input and send request using getGenderFromAPI function
// then handle the output data using handleOutputData function
async function sendRequest(e) {
    document.getElementById("saved-data").innerHTML = "";
    document.getElementById("api-data").innerHTML = "";
    document.getElementById("prob").innerHTML = "";
    console.log("clicked on submit");
    let name = document.getElementById("name").value;
    let validation = validator()
    if (name == "") {
        console.log("username was empty");
        showError("Enter a name")
        return;
    }
    else if(validation !== ""){
        console.log(validation)
        showError(validation)
        return
    }
    e.preventDefault();
    let data = await getGenderFromAPI(name);
    serverOutput = data;
    console.log(data)
    handleOutputData(data)
}

//handles the output data either by showing the saved data or the server data (API)
function handleOutputData(data){

    showSavedData(data.name)
    showAPIData(data)
}

// saved data either declared by client or from server
function saveData(){
    let name = document.getElementById("name").value;
    let gender;
    if(document.getElementById("gender-male").checked){
        gender = "male";
    }
    else if(document.getElementById("gender-female").checked){
        gender = "female";
    }
    else {
        gender = serverOutput.gender
    }
    console.log(gender)
    window.localStorage.setItem(name, gender);
}

// clears a specific data from local storage using a name as the key
function clearSavedData(){
    let name = document.getElementById("name").value;
    window.localStorage.removeItem(name)
}

// searches local storage to fetch the gender of a specific name and if found displays it on the webpage
function showSavedData(name){
    console.log("s")
    console.log(window.localStorage.getItem(name))
    let gender = window.localStorage.getItem(name);
    if (gender !== null){
        let p = document.getElementById("saved-data");
        p.innerHTML = gender;
    }
}

// checks if the server had the gender and if true displays it existed on the webpage
function showAPIData(data){
    if (data.gender != null){
        document.getElementById("api-data").innerHTML = data.gender ;
        document.getElementById("prob").innerHTML = data.probability;
    }


}

// checks if the input is valid and if not displays an error massage
function checkInput(){
    let err = validator()
    showError(err)
}

// validates input by length and regex
function validator(){
    let input = document.getElementById("name").value;
    let length = input.length
    var reg = /^[a-zA-Z\s]*$/;
    let lenErr = ""
    let regErr = ""
    if(length > 255){
        lenErr = "Input too big. "
    }
    if(!reg.test(input)){
        regErr = "Only English alphabet and space are allowed."
    }
    return lenErr + regErr
}

// assigning appropriate listeners to each element on the webpage
document.getElementById("submit").addEventListener('click', sendRequest);
document.getElementById("save").addEventListener('click', saveData)
document.getElementById("clear").addEventListener('click', clearSavedData)
document.getElementById("name").addEventListener('input', checkInput)
// the api url to send requests
const url = "https://api.genderize.io/"

//some variables to use globally
var serverOutput;
var oldNam;

// shows appropriate error message on the web page using a <p> tag (modifying the content of the tag)
function showError(errorContent) {
    let textareaObject = document.getElementById("error");
    textareaObject.innerHTML = errorContent;
    setTimeout(() => { // removes the error message from screen after 5 seconds.
        textareaObject.innerHTML = ""
    }, 5000)

}

// get data from API and return the json value.
async function getGenderFromAPI(name) {
    try {
        // make a GET http request using fetch api
        let response = await fetch(url+"?name="+name)
        let json = await response.json();
        //if the response was ok
        if (response.status == 200) {
            //check if the name was found on server
            if (json.gender == null){
                showError("Name not found on server")
            }
            return json
        }
        showError(`Request failed with error ${response.status}`)
    } catch (e) {
        console.log(e);
        showError("Unknown Error")
    }
}

// clears the output section on web page and reads input and send request using getGenderFromAPI function
// then handle the output data using handleOutputData function
async function sendRequest(e) {
    //clear the html output area
    document.getElementById("saved-data").innerHTML = "";
    document.getElementById("api-data").innerHTML = "";
    document.getElementById("prob").innerHTML = "";
    //get input name from html input tag
    let name = document.getElementById("name").value;
    //validate the input
    let validation = validator()
    if(validation !== ""){
        showError(validation)
        return
    }
    //prevent the event from doing the default function
    e.preventDefault();
    //set this new name as the old name in order to use it in "save" function
    oldNam = name;
    //send a request and get the data
    let data = await getGenderFromAPI(name);
    // set the data as "serverData"
    serverOutput = data;
    //handle the data in order to be displayed
    handleOutputData(data)
}

//handles the output data either by showing the saved data or the server data (API)
function handleOutputData(data){

    showSavedData(data.name)
    showAPIData(data)
}

// saved data either declared by client or from server
function saveData(){
    let validation = validator()
    if(validation !== ""){
        showError(validation)
        return
    }
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

    // if the last name that was fetched from server was the same name we are saving we can update the html
    if(oldNam == name){
        document.getElementById("saved-data").innerHTML = gender;
    }


    window.localStorage.setItem(name, gender);
}

// clears a specific data from local storage using a name as the key
function clearSavedData(){
    let name = document.getElementById("name").value;
    window.localStorage.removeItem(name)
    // if the last name that was fetched from server was the same name we are saving we can update the html
    if(oldNam == name){
        document.getElementById("saved-data").innerHTML = "";
    }
}

// searches local storage to fetch the gender of a specific name and if found displays it on the webpage
function showSavedData(name){
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

// checks if the input is valid and if not displays an error message
function checkInput(){
    let err = validator()
    showError(err)
}

// validates input by length and regex
function validator(){

    let input = document.getElementById("name").value;
    if (input == "") {

        return "Enter a name";
    }
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
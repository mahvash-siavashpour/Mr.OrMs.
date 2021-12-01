const url = "https://api.genderize.io/"


function showError(errorContent) {
    console.log("Show error")
    let textareaObject = document.getElementById("error");
    textareaObject.innerHTML = errorContent;
    setTimeout(() => { // removes the error message from screen after 4 seconds.
        textareaObject.innerHTML = ""
    }, 3000)

}

// get user data from API and return the json value.
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

// the process of sending data and fill it in view.
async function sendRequest(e) {
    console.log("clicked on submit");
    let username = document.getElementById("name").value;
    if (username == "") {
        console.log("username was empty");
        showError("Enter a name")
        return;
    }
    e.preventDefault();
    let userData = await getGenderFromAPI(username);
    console.log(userData)
    handleUserData(userData)
}

function handleUserData(userData){
    document.getElementById("saved-data").innerHTML = "";
    document.getElementById("api-data").innerHTML = "";
    document.getElementById("prob").innerHTML = "";
    showSavedData(userData.name)
    showAPIData(userData)
}

function saveData(){
    let name = document.getElementById("name").value;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    window.localStorage.setItem(name, gender);
}

function clearSavedData(){
    let name = document.getElementById("name").value;
    window.localStorage.removeItem(name)
}

function showSavedData(name){
    console.log("s")
    console.log(window.localStorage.getItem(name))
    let gender = window.localStorage.getItem(name);
    if (gender !== null){
        let p = document.getElementById("saved-data");
        p.innerHTML = gender;
    }
}

function showAPIData(data){
    if (data.gender != null){
        document.getElementById("api-data").innerHTML = data.gender ;
        document.getElementById("prob").innerHTML = data.probability;
    }


}

document.getElementById("submit").addEventListener('click', sendRequest);
document.getElementById("save").addEventListener('click', saveData)
document.getElementById("clear").addEventListener('click', clearSavedData)
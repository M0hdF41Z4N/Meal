// To store all meals
let all_meals = [];
// To store fav meals
let fav_meals = [];
// To store input
let input_ele = document.getElementById("search");
// result summary
let result_output = document.getElementById("result-header");
// Getting result section element from HTML
let result_section = document.querySelector("#result-section .row"); 
// Getting favourite list from HTML
let list = document.getElementById("fav-list");
//  Getting product element from HTML
let product = document.getElementById("product-details");
// To store meals with persistant
let meals ="MEALS", favMeals = "FAV";

let forms = document.querySelector('form');



// Function to get ID to show details of Meal | For Meal Detail Page
function detailsOf(mealId){
    localStorage.setItem("ID",mealId);
}

// Function to add meal to favourite list
function addToFav(mealId) {
    // If Already added
    if (fav_meals.includes(mealId)) {
        // For debugging purpose
        // console.log("Already added");
    }else {
        // Add meal id to list
        fav_meals.push(mealId);
        // updating local storage
        localStorage.setItem(favMeals,fav_meals);
    }
}

// Function to delete favourite meal from list
function deleteFromFav(mealId) {
    // Filtering the list
    let updatedList = fav_meals.filter(ele => ele != mealId);
    // Updating favourite list
    fav_meals = updatedList;
    // Updating local storage
    localStorage.setItem(favMeals,fav_meals);
    // Rendering to HTML Page
    renderFavList();
}



// IIFE to invoke function according to page 
(function () {
    // Getting favourite meal from local storage when fav list is empty
    if ((localStorage.getItem(favMeals) != null && localStorage[favMeals] != '') && (fav_meals.length < 1)) {
        fav_meals = localStorage.getItem(favMeals).split(',');
    }
    // when Favourite list page visited
    if (window.location.href.includes('favourite_page.html')) {
        // Rendering favourite list;
        renderFavList();
    }
    // when Meal detail page visited
    else if (window.location.href.includes('product_page.html')) {
        // Getting meal id from local storage
        let mealId = localStorage.getItem("ID");
        // Fetching meal from API
        let meal = fetchMealById(mealId);
        // Rendering details to HTML page
        renderProductDetails(meal);
    }
    
})();

// Function to fetch all meals
async function fetchMeals(text) {
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s="+text;

    result_output.innerHTML = "Loading";
    // Try block
    try {
    // Get Request : return promise
    let response = await fetch(url);
    // API response to json
    let apiResponse = await response.json();
    let meals = apiResponse.meals;
    // adding all meals to array
    for (let i=0 ; i<meals.length; i++) {
        // Adding meals to array to store.
        all_meals.push(meals[i]);
    }
    // Rendering Summary of result
    result_output.innerHTML = "You Searched for <b><q>"+text+"</q></b>.<br> About "+meals.length+" meals found";
    // Rendering all meals in array to HTML Page
    renderAllMeals();
    // For Debugging purpose
    // return meals;
        }
    // Catch block
    catch(error) {
        // Handling Error
        result_output.innerHTML = "Internal Server Error ! Try Something else";
    }
}

// Function to fetch favourite meal using meal ID
async function fetchMealById(mealId) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+mealId;
    // Try Block
    try {
        // Get Request : returns promise
        let response = await fetch(url);
        // API response to json
        let meal = await response.json();
        // Condition for Favourite List Page
        if (meal && list) {
            // Adding list element (favourite meal) to HTML DOM
            addFavMealToDom(meal.meals[0]);
            return meal.meals;
        }
        // Condition for Meal Details Page
        else if(meal && product) {
            // Redering Meal to HTML DOM
            renderProductDetails(meal.meals[0]);
            return meal.meals;
        }
    }
    // Catch Block
    catch(error) {
        // Handling Error
        // console.log("unable to fetch details");
    }
}



// Function to render all meals to HTML page or DOM structure
function addMealToDom(meal) {
    // Creating div 
    let div = document.createElement('div');
    // Adding class to div
    div.classList.add('col');
    // Adding content to column
    div.innerHTML = `
        <div class="card" id="meal-card">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="meal-img">
            <div class="card-body" id="${meal.idMeal}">
                <h5 class="card-title">${meal.strMeal}</h5>
                <a href="./product_page.html" class="btn btn-warning text-white" onclick="detailsOf(${meal.idMeal})">View Meal</a>
                <a class="btn bi bi-${fav_meals.includes(meal.idMeal) ? 'heart-fill' : 'heart'}" id="fav-btn"></a>
            </div>
        </div>
        `
    // Adding column element to row / result section element
    result_section.append(div);
}

// Function to render all meals to HTML DOM
function renderAllMeals() {
    // Resetting result section
    result_section.innerHTML = '';
    // Adding all meals to DOM
    for (let i=0 ; i<all_meals.length; i++) {
        // Function call to add Meal to HTML DOM
        addMealToDom(all_meals[i]);
    }
    // Resetting all meals array to empty
    all_meals = [];
}

// Function to add meal to HTML DOM
function addFavMealToDom(meal) {
    // Creating list item element
    let list_item = document.createElement('li') ;
    // Adding class to element
    list_item.classList.add('list-group-item');
    // Adding ID element
    list_item.setAttribute('id',meal.idMeal);
    // setting context of elment
    list_item.innerHTML = `
        <img src="${meal.strMealThumb}" 
            alt="food-img" class="card-fluid" >
            <div class="ms-2 me-auto">
            <div class="fw-bold">${meal.strMeal}</div>
            ${meal.strArea}
            </div>
        <img src="./cross.png" alt="remove-fav" id="delete-btn">    `
    // Appending to list
    list.append(list_item);
}

// Function to render meal to DOM | Favourite page
function renderFavList() {
    // Resetting list section
    list.innerHTML = '';
    // Adding ID to elment
    list_head = document.getElementById('list-summary');
    // Condition to check if favourite meal availible or not
    if (fav_meals.length < 1 ) {
        list_head.innerHTML = "Oops ! No favourite meals found. Try to add some."
    }else {
        list_head.innerHTML = "Your "+ fav_meals.length +" favourite meals."
         // Adding all meals to DOM
        for (let i=0 ; i<fav_meals.length; i++) {
            fetchMealById(fav_meals[i]);
        }
    }
}

// Function to render meal details
function renderProductDetails(meal) {
    let product_img = document.getElementById('product-image');
    let product_title = document.getElementById('content-text');
    let ingredents =document.getElementById('ingredents');
    let tags =document.getElementById('tags');
    let region =document.getElementById('region');
    let category =document.getElementById('category');
    let video_link = document.getElementById('video-link');
    video_link.href = meal.strYoutube;
    product_img.setAttribute('src',meal.strMealThumb);
    product_title.innerHTML = meal.strMeal;
    ingredents.innerHTML = meal.strInstructions;
    tags.innerHTML = meal.strTags;
    region.innerHTML= meal.strArea;
    category.innerHTML = meal.strCategory;
}




// Funtion to handle diffenet clicks on pages
function clickHandler(event) {
    let target = event.target;
    // Condition for when search btn clicked
    if (target.id === 'btn-search') {
        let search_text = input_ele.value;
        // Condition if search text empty or not
        if (search_text) {
            // Function call to fetch all meals matching search term
            fetchMeals(search_text);
            // reseting input field or search field
            input_ele.value = '';
        }else {
            // Error Handling
            result_output.innerHTML = "Can't be empty.";
        } 
    }
    // Condition for : when favourite btn clicked
    else if (target.id === 'fav-btn' ) {
        target.classList.remove("bi-heart");
        // Filling btn with color
        target.classList.add("bi-heart-fill");
        // Getting parent node
        let meal = target.parentNode;
        // Getting id of meal
        let mealId = meal.id;
        // Function call to add meal to favourite list
        addToFav(mealId);
    }
    // Condition for : when delete btn clicked
    else if (target.id === 'delete-btn') {
        // Getting parent node
        let list_item = target.parentNode;
        // Function call to delete meal from favourite list with meal id
        deleteFromFav(list_item.id);
    }
}


// Event delegation
document.addEventListener('click',clickHandler);



// Check if we are at home page 
if (window.location.href.includes('Meal'))
{
    // Removing default behaviour of form
    forms.addEventListener('submit',function(event) {
        event.preventDefault();
    });
}

//API URLs
const mealdbUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const mealdbRandomUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';
const cocktaildbUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

//Selectors
const mealSearchForm = $('#mealSearchForm');
const randomRecipeBtn = $('#randomRecipeBtn');
const findRecipeBtn = $('#findRecipeBtn');
const mealFront = $('#meal-front');
const mealBack = $('#meal-back');

//API Call Function
function fetchMealByName(mealName) {
    console.log(mealdbUrl + mealName);
    fetch(mealdbUrl + mealName)
        // .then(response => {
        //     if (!response.ok) {
        //       console.log(mealdbUrl + mealName);
        //         throw new Error('Network response was not ok ' + response.status);
        //     }
        //     return response.json();
        // })
        .then(data => {
            // if (!data || !data.meals || data.meals.length === 0) {
            //     console.log('No meals found for the search term: ' + mealName);
            //     return;
            // }
            //create meal elements
            console.log(data);
            const meal = data.meals[0];
            const $mealPicture = $('<img>').attr('src', meal.strMealThumb)
            const $mealName = $('<div>').text(meal.strMeal);
            const $mealInstructions = $('<div>').text(meal.strInstructions);
            //append meal elements to the card
            mealFront.append($mealPicture);
            mealFront.append($mealPicture).append($mealName);
            mealBack.append($mealInstructions);
        }
        )
        .catch(error => {
            console.error('Error fetching meal:', error);
        });
}

function fetchRandomMeal() {
    fetch(mealdbRandomUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
            if (!data || !data.meals || data.meals.length === 0) {
                console.log('No meals found for the random meal request');
                return;
            }
            //create meal elements
            const meal = data.meals[0];
            const $mealPicture = $('<img>').attr('src', meal.strMealThumb)
            const $mealName = $('<div>').text(meal.strMeal);
            const $mealInstructions = $('<div>').text(meal.strInstructions);
            //append meal elements to the card
            mealFront.append($mealPicture);
            mealFront.append($mealPicture).append($mealName);
            mealBack.append($mealInstructions);
        }
        )
        .catch(error => {
            console.error('Error fetching meal:', error);
        });
}

//Event Listeners
findRecipeBtn.on('click', e => {
    e.preventDefault();
    const mealName = $('#searchInput').val();
    //console.log(mealName);
    if (mealName) {
        fetchMealByName(mealName);
    }
});

randomRecipeBtn.on('click', e => {
    e.stopPropagation();
    fetchRandomMeal();
});
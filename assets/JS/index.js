//API URLs
const mealdbUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const mealdbRandomUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
const cocktaildbUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

//Selectors
const mealSearchForm = $("#mealSearchForm");
const randomRecipeBtn = $("#randomRecipeBtn");
const findRecipeBtn = $("#findRecipeBtn");
const mealCardContainer = $("#mealCardContainer");
const mealFront = $("#meal-front");
const mealBack = $("#meal-back");
const savedMeals = $("#savedMeals");
const mealCard = $(".meal-card");
const drinkFront = $("#drinkFront");
const drinkBack = $("#drinkBack");
const searchInput = $("#searchInput");

//API Call Function for meals
function fetchMealByName(mealURL) {
  fetch(mealURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      // Check if data or meals exist
      if (!data || !data.meals || data.meals.length === 0) {
        console.log("No meals found for the search term: " + mealName);
        return;
      }
      // Create meal elements
      const meal = data.meals[0];
      const $mealPicture = $("<img>").attr("src", meal.strMealThumb);
      const $mealName = $("<div>").text(meal.strMeal);
      const $mealIngredients = $("<ul>");
      console.log(meal);

      let ingredients = [];
      for (let i = 1; i < 20; i++) {
        if (meal[`strIngredient${i}`] !== "") {
          ingredients.push(
            meal[`strIngredient${i}`] + ": " + meal[`strMeasure${i}`],
          );
        } else {
          break;
        }
      }
      const ingredientList = ingredients.map((i) => {
        return $("<li>").text(i);
      });
      $mealIngredients.append(ingredientList);
      console.log(ingredients);

      // If instructions exist, try to split into steps, otherwise show full text
      let instructionsContent;
      if (meal.strInstructions) {
        // Attempt to split by common step markers; fallback to full text
        const steps = meal.strInstructions
          // Split on each "STEP N\r\n" marker
          .split(/\r\n/)
          // Drop the empty first chunk
          .filter(Boolean)
          .map((s) => {
            // Trims trailing \r\n\r\n etc.
            return s.trim();
          });
        if (steps) {
          $stepsList = $("<ul>").addClass("steps-list");
          steps.forEach((s) => $stepsList.append($("<li>").text(s)));
          instructionsContent = $stepsList;
        }
      } else {
        instructionsContent = $("<p>").text("No instructions available.");
      }

      // Append meal elements to the card and show container
      mealCardContainer.removeClass("hidden");
      mealFront.empty().append($mealPicture, $mealName, $mealIngredients);
      mealBack.empty().append(instructionsContent);
    })
    .catch((error) => {
      console.error("Error fetching meal:", error);
    });
}

//API Call Function for drinks
function fetchRandomCocktail() {
  fetch(cocktaildbUrl)
    .then((response) => {
      if (!response.ok) {
        console.error("Network Response was not ok " + response.status);
        return;
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !data.drinks || data.drinks.length === 0) {
        console.log("No cocktails found");
        return;
      }
      const drink = data.drinks[0];
      const $drinkPicture = $("<img>").attr("src", drink.strDrinkThumb);
      const $drinkName = $("<div>").text(drink.strDrink);
      const $drinkIngredients = $("<ul>");
      console.log(drink);

      let ingredients = [];
      for (let i = 1; i < 20; i++) {
        if (drink[`strIngredient${i}`] !== null) {
          ingredients.push(
            drink[`strIngredient${i}`] + ": " + drink[`strMeasure${i}`],
          );
        } else {
          break;
        }
      }
      const ingredientList = ingredients.map((i) => {
        return $("<li>").text(i);
      });
      $drinkIngredients.append(ingredientList);
      console.log(ingredients);

      let instructionsContent;
      if (drink.strInstructions) {
        const steps = drink.strInstructions
          .split(/\r\n/)
          .filter(Boolean)
          .map((s) => {
            return s.trim();
          });
        if (steps) {
          $stepsList = $("<ul>").addClass("steps-list");
          steps.forEach((s) => $stepsList.append($("<li>").text(s)));
          instructionsContent = $stepsList;
        }
      } else {
        instructionsContent = $("<p>").text("No instructions available.");
      }

      drinkFront.empty().append($drinkPicture, $drinkName, $drinkIngredients);
      drinkBack.empty().append(instructionsContent);
    });
}

//Event Listeners
findRecipeBtn.on("click", (e) => {
  e.stopPropagation();
  e.preventDefault();
  const mealName = searchInput.val();
  if (mealName) {
    fetchMealByName(mealdbUrl + mealName);
    fetchRandomCocktail();
  }
  searchInput.val("");
});

randomRecipeBtn.on("click", (e) => {
  e.stopPropagation();
  e.preventDefault();
  fetchMealByName(mealdbRandomUrl);
  fetchRandomCocktail();
  searchInput.val("");
});

// Add click listener for meal card flip
mealCard.on("click", function () {
  const card = $(this);
  if (card.hasClass("flipped")) {
    card.removeClass("flipped");
    card.css("transform", "rotateY(0deg)");
  } else {
    card.addClass("flipped");
    card.css("transform", "rotateY(180deg)");
  }
});

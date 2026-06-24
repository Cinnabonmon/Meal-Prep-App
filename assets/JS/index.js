//API URLs
const mealdbUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const mealdbRandomUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
const cocktaildbUrl =
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

//Selectors
const mealSearchForm = $("#mealSearchForm");
const randomRecipeBtn = $("#randomRecipeBtn");
const findRecipeBtn = $("#findRecipeBtn");
const mealCardContainer = $("#mealCardContainer");
const mealFront = $("#meal-front");
const mealBack = $("#meal-back");
const savedMeals = $("#savedMeals");
const mealCard = $(".meal-card");

//API Call Function
function fetchMealByName(mealURL) {
  console.log(mealURL);

  fetch(mealURL)
    .then((response) => {
      if (!response.ok) {
        console.log(mealURL);
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
      console.log(data);
      const meal = data.meals[0];
      const $mealPicture = $("<img>").attr("src", meal.strMealThumb);
      const $mealName = $("<div>").text(meal.strMeal);

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
        console.log(steps);
        if (steps) {
          $stepsList = $("<ul>").addClass("steps-list");
          steps.forEach((s) => $stepsList.append($("<li>").text(s)));
          instructionsContent = $stepsList;
        }
      } else {
        instructionsContent = $("<p>").text("No instructions available.");
      }
      console.log(instructionsContent);

      // Append meal elements to the card and show container
      mealCardContainer.removeClass("hidden");
      mealFront.empty().append($mealPicture, $mealName);
      mealBack.empty().append(instructionsContent);
    })
    .catch((error) => {
      console.error("Error fetching meal:", error);
    });
}

//Event Listeners
findRecipeBtn.on("click", (e) => {
  e.stopPropagation();
  e.preventDefault();
  const mealName = $("#searchInput").val();
  //console.log(mealName);
  if (mealName) {
    fetchMealByName(mealdbUrl + mealName);
  }
});

randomRecipeBtn.on("click", (e) => {
  e.stopPropagation();
  e.preventDefault();
  fetchMealByName(mealdbRandomUrl);
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

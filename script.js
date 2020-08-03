const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');


// Search meal and fetch from api
function searchMeal(e) {
    e.preventDefault();
    // Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    // Clear single meal
    singleMealEl.innerHTML = '';

    // Get ssearch term
    const term = search.value;

    // Check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(result => result.json())
            .then(data => {
                // console.log(data);
                resultHeading.innerHTML = `<h2>Search results for '${term}'</h2>`;

                if (data.meals === null) {
                    resultHeading.innerHTML = '<p>There are no search results, try again</p>';
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `)
                        .join('');
                }
            });
        // Clear search text
        search.value = '';
    } else {
        alert('Please enter a search term');
    }


}

// Fetch meal by id
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(result => result.json())
        .then(data => { 
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
}

//Fetch random meal
function getRandomMeal(){
    // Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(result => result.json())
    .then(data => {
        const meal = data.meals[0]
        addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal){
    const ingredients= [];

    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            continue;
        }
    }

    singleMealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Event Listeners
submit.addEventListener('click', searchMeal);
random.addEventListener('click', getRandomMeal);


mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});
/*Fetching the id so that we will add the event listener to it*/
const searchBox = document.getElementById("search-box");
const searchList = document.getElementById("instant-search__list");
const heroDetails = document.getElementById("hero-details");

/*Adding Event Listener To that search box on keyup event*/
let delay;
searchBox.addEventListener("keyup", (event) => {
    clearTimeout(delay);
    delay = setTimeout(() => {
        const str = searchBox.value;
        while (searchList.firstChild) {
            searchList.removeChild(searchList.firstChild);
        }
        if (str.length >= 1) {
            const xhr = new XMLHttpRequest();
            xhr.open(
                "GET",
                `https://www.superheroapi.com/api.php/4529675383738909/search/${str}`,
                true
            );
            xhr.onload = () => {
                var heroes = JSON.parse(xhr.response);
                var results = heroes.results;
                // if (!searchList.firstChild)
                for (var result of results) {
                    const item = `<li class="instant-search__result" ><span id="${result.id}">${result.name} </span></li>`;
                    const position = "beforeend";
                    searchList.insertAdjacentHTML(position, item);
                }
            };
            xhr.send();
        }
    }, 50);
});
/*Function when any search list is clicked*/
searchList.addEventListener("click", (event) => {
    var heroId = event.target.id;
    window.location.href = `./superhero.html?${heroId}`;
});
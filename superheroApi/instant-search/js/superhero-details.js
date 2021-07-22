var heroCard = function() {
    const xhr = new XMLHttpRequest();
    var url = document.location.href;
    params = url.split("?")[1];
    xhr.open(
        "GET",
        `https://www.superheroapi.com/api.php/4529675383738909/${params}`,
        true
    );
    xhr.onload = () => {
        var heroDetail = JSON.parse(xhr.response);
        var results = heroDetail.appearance;
        document.getElementById("hero-img").src = `${heroDetail.image.url}`;
        document.getElementById("hero-name").innerHTML = `${heroDetail.name}`;
        document.getElementById(
            "hero-race"
        ).innerHTML = `Race : ${heroDetail.appearance.race}`;
        document.getElementById(
            "hero-gender"
        ).innerHTML = `Gender : ${heroDetail.appearance.gender}`;
        document.getElementById(
            "hero-height"
        ).innerHTML = `Height : ${heroDetail.appearance.height[0]}`;
        document.getElementById(
            "hero-weight"
        ).innerHTML = `Weight : ${heroDetail.appearance.weight[1]}`;
        document.getElementById(
            "eye-color"
        ).innerHTML = `Eye Color : ${heroDetail.appearance["eye-color"]}`;
        document.getElementById(
            "hair-color"
        ).innerHTML = `Hair Color : ${heroDetail.appearance["hair-color"]}`;
        document.getElementById(
            "full-name"
        ).innerHTML = `${heroDetail.biography["full-name"]}`;
        document.getElementById(
            "publisher-name"
        ).innerHTML = `${heroDetail.biography.publisher}`;
        document.getElementById(
            "combat"
        ).innerHTML = `Combat : ${heroDetail.powerstats.combat}`;
        document.getElementById(
            "durability"
        ).innerHTML = `Durability : ${heroDetail.powerstats.durability}`;
        document.getElementById(
            "intelligence"
        ).innerHTML = `Intelligence : ${heroDetail.powerstats.intelligence}`;
        document.getElementById(
            "power"
        ).innerHTML = `Power : ${heroDetail.powerstats.power}`;
        document.getElementById(
            "speed"
        ).innerHTML = `Speed : ${heroDetail.powerstats.speed}`;
        document.getElementById(
            "strength"
        ).innerHTML = `Strength : ${heroDetail.powerstats.strength}`;
        document.getElementById(
            "base"
        ).innerHTML = `BASE : <br>${heroDetail.work.base}.`;
        document.getElementById(
            "occupation"
        ).innerHTML = `Occupation : ${heroDetail.work.occupation}.`;
        /*Adding data to the local storage*/
        var favoriteBtn = document.getElementById("favorite-btn");
        favoriteBtn.addEventListener("click", () => {
            var receiveddata = JSON.stringify(heroDetail);
            // alert("Added To Favorite");
            localStorage.setItem(heroDetail.id, receiveddata);
        });
        /*Removing data from local storage*/
        document
            .getElementById("unfavorite-btn")
            .addEventListener("click", () => {
                // alert("Removed From Favorite");
                localStorage.removeItem(heroDetail.id);
            });
    };
    xhr.send();
};
heroCard();
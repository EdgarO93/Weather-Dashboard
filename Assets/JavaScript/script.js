let $searchButton = $("#searchbtn");
let $searchInput = $("#searchInput");

function searchButtonHandler() {
    let searchInput = $searchInput.val();
    searchInput = "chicago"

    let apiKey = "b21a3a98c66a430705a9406d77dd7091";
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}`
$.ajax({
        url: weatherUrl,
        success: function (data) {
            console.log(data);
        }
    }
    )
}

$searchButton.click(searchButtonHandler);

//&units=imperial`
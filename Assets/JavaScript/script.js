let $searchButton = $("#searchbtn");
let $searchInput = $("#searchInput");

function getPanelHTML(name,date,temp){
    return `
    <div class = "col-sm-2">
        <div class= "panel panel-default">
            <div class ="panel-heading">${name},${date}</div>
            <div class = "panel-body">
                <p> Temperature: ${temp} </p>
                <p> wind </p>
                <p> humidity </p>
                <p> uv </p>
            </div>

        </div>
    </div>
    `
}

function searchButtonHandler() {
    let searchInput = $searchInput.val();
    searchInput = "chicago"

    let apiKey = "b21a3a98c66a430705a9406d77dd7091";
    let weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=imperial&exclude=minutely,hour&appid=${apiKey}`

    $.ajax({
        url: weatherUrl,
        success: function (data) {
        
            let appendedDates = [];
            let appendedCount = 0
            console.log(data);
            for (let i=0; i<data.list.length; i++){
                let curr= data.list[i]
                let currDateText= curr.dt_txt
                let currDate = currDateText.split(" ")[0];
                let name= data.city.name

                if (!appendedDates.includes(currDate))
                {
                    appendedDates.push(currDate)
                    let temp= curr.main.temp;
                    
                    
                    $("#myWeather").append(
                        getPanelHTML(name,currDateText,temp)
                    )
                    appendedCount ++;
                    if (appendedCount >4){
                        break;
                    }

                }

            }
        }
    }
    )
}

$searchButton.click(searchButtonHandler);

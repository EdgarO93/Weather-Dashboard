let $searchButton = $("#searchbtn");
let $searchInput = $("#searchInput");


// function getDayOfWeek(date) {
//     let dayOfWeek = new Date(date).getDay();    
//     return isNaN(dayOfWeek) ? null : 
//       ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek+1];
//   }

// template literal `can include html code
//can pass javascript variables thru string
function getPanelHTML(name,updateDate, weekday, temp,wind,humid,icon){
    return `
    <div class = "col-sm-2">
        <div class= "panel panel-default">
            <div class ="panel-heading">${updateDate}</div>
            <div class ="panel-heading">${weekday}</div>
            <div class ="panel-heading">${name}</div>
            <div class = "panel-body">
            <img src=" http://openweathermap.org/img/wn/${icon}@2x.png" /> 
                <p> Average Temperature: ${temp} </p>
                <p> Wind Speed: ${wind} mph</p>
                <p> Humidity: ${humid}% </p>
                <p> uv </p>
            </div>

        </div>
    </div>
    `
}

function searchButtonHandler() {
    $("#myWeather").empty();
    let searchInput = $searchInput.val();
    // searchInput = "chicago"

    let apiKey = "b21a3a98c66a430705a9406d77dd7091";
    let weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`

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
                let updateDate = moment(currDate, 'YYYY/MM/DD').format('MM/DD/YYYY')
                let weekday= moment(currDate, 'YYYY/MM/DD').format('dddd')

                let name= data.city.name
                let wind= curr.wind.speed
                let icon= curr.weather[0].icon
                let humid= curr.main.temp;

                if (!appendedDates.includes(currDate))
                {
                    appendedDates.push(currDate)
                    let temp= curr.main.temp;
                    // let weekday= getDayOfWeek(currDate);
                    
                    $("#myWeather").append(
                        getPanelHTML(name,updateDate,weekday,temp,wind,humid,icon)
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

//local storage, list of past searches




$searchButton.click(searchButtonHandler);

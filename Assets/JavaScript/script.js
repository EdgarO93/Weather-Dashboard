let $searchButton = $("#searchbtn");
let $searchInput = $("#searchInput");
let cityLat;
let cityLon;
let UVp= $("#UV");
var uvId;

// function getDayOfWeek(date) {
//     let dayOfWeek = new Date(date).getDay();    
//     return isNaN(dayOfWeek) ? null : 
//       ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek+1];
//   }

// template literal `can include html code
//can pass javascript variables thru string
function getPanelHTML(name, updateDate, weekday, temp, wind, humid, icon) {
    return `
    <div class = "col-sm-2">
        <div class= "panel panel-default">
         <div class ="panel-heading"> Forecast Weather </div>
            <div class ="panel-heading"> ${updateDate}</div>
            <div class ="panel-heading"> ${weekday}</div>
            <div class ="panel-heading">${name}</div>
            <div class = "panel-body">
            <img src=" http://openweathermap.org/img/wn/${icon}@2x.png" /> 
                <p> Average Temperature: ${temp} </p>
                <p> Wind Speed: ${wind} mph</p>
                <p> Humidity: ${humid}% </p>
            </div>

        </div>
    </div>
    `
}

function getPanelHTML2(name, today, temp, wind, humid, icon,uvId) {
    return `
    <div class = "col-12 col-md-8 col-xl-9">
        <div class= "panel panel-default">
        <div class ="panel-heading">Current Weather</div>
            <div class ="panel-heading">${today}</div>
            <div class ="panel-heading">${name}</div>
            <div class = "panel-body">
            <img src=" http://openweathermap.org/img/wn/${icon}@2x.png" /> 
                <p> Temperature: ${temp} </p>
                <p> Wind Speed: ${wind} mph</p>
                <p> Humidity: ${humid}% </p>
                <p id="uvIdx"> UV Index: ${uvId} </p>
            </div>

        </div>
    </div>
    `
}

function searchButtonHandler() {
    $("#myWeather").empty();
    $("#current").empty();
    let searchInput = $searchInput.val();
    // searchInput = "chicago"



    let apiKey = "b21a3a98c66a430705a9406d77dd7091";
    let weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`
    //vairable to get current weather info
    let dataUrl =`https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&appid=${apiKey}`


    $.ajax({
        url: weatherUrl,
        success: function (data) {

            let appendedDates = [];
            let appendedCount = 0
            
            console.log(data);
            for (let i = 0; i < data.list.length; i++) {
                let curr = data.list[i]
                let currDateText = curr.dt_txt
                let currDate = currDateText.split(" ")[0];
                let updateDate = moment(currDate, 'YYYY/MM/DD').format('MM/DD/YYYY')
                let weekday = moment(currDate, 'YYYY/MM/DD').format('dddd')

                let name = data.city.name
                let wind = curr.wind.speed
                let icon = curr.weather[0].icon
                let humid = curr.main.temp;
    
                


                if (!appendedDates.includes(currDate)) {
                    appendedDates.push(currDate)
                    let temp = curr.main.temp;
                    // let weekday= getDayOfWeek(currDate);
                    

                 


                    $("#myWeather").append(
                        getPanelHTML(name, updateDate, weekday, temp, wind, humid, icon)
                    )
                    appendedCount++;
                    if (appendedCount > 4) {
                        break;
                    }
                   

                }

            }

            
        }
    }
    )
  
//second call for UVindex and current data


$.ajax({
    url: dataUrl,
    success: function (data) {

        let appendedData = [];
        
        console.log(data)
        
            // let curr2 = data.list[i]
            let currDateUnix = data.dt
            // let currDate = currDateText.split(" ")[0];
            let today = moment.unix(currDateUnix).format('MM/DD/YYYY')
            // let weekday = moment(currDate, 'YYYY/MM/DD').format('dddd')

            let name = data.name
            let wind = data.wind.speed
            let icon = data.weather[0].icon
            let humid = data.main.temp;
           let lat = data.coord.lat;
           let lon = data.coord.lon;
           let uvURL =`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=imperial&appid=${apiKey}`
          
          function getUVidx () { $.ajax({
            url: uvURL,
            method: 'GET'
          }).then(function(data) {
            //   let appendedData2 =[]
            console.log(data)
            // console.log(data.current.uvi);
           var uvId= data.current.uvi;
        //    console.log(uvId); its defining here
          });
        }
        getUVidx();
        var uvId = getUVidx();
    //    var uvId = getUVidx() 
     
    console.log(uvId)
            if (!appendedData.includes(today)) {
                appendedData.push(today)
                let temp = data.main.temp;
                // let weekday= getDayOfWeek(currDate);
                

             


                $("#current").append(
                    getPanelHTML2(name, today, temp, wind, humid, icon,uvId)
                )
        // for (let i=0; i<data.list.length; i++){
        //     let curr2= data.list[i]
        //     let UVdat= curr2.daily[0].temp.uvi}
        //     $(UVp).append('<span>${UVdat}</span>')
        } 

}})
}

// let cityLat= data.city.coord.lat
// let cityLon=data.city.coord.lon


// //second call for UVindex and current data

// let dataUrl =`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly&units=imperial&appid=${apiKey}`
// $.ajax({
//     url: dataUrl,
//     success: function (data) {

//         console.log(data);
//         for (let i=0; i<data.list.length; i++){
//             let curr2= data.list[i]
//             let UVdat= curr2.daily[0].temp.uvi}
//         }}) 
//local storage, list of past searches




$searchButton.click(searchButtonHandler);

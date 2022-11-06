// import groupFlightData from './groupFlightData.js';
const groupFlightData = require("../data/rawAnimatedFlights.json");

const flightInfo = [];

// console.log(typeof groupFlightData);

// extract the lat, long, and altitude from the flight data and push to flightInfo array
for (let i = 0; i < groupFlightData.length; i++) {
  const flightGroup = {};

  flightGroup["date"] = groupFlightData[i].date;
  flightGroup["startTime"] = groupFlightData[i].startTime;
  flightGroup["endTime"] = groupFlightData[i].endTime;
  flightGroup["flights"] = [];

  let flight = groupFlightData[i].flights;
  console.log(flight.length);
  // for the array in the flights object get the properties of each iterable item
  for (let j = 0; j < flight.length; j++) {
    const flightProps = {
      lat1: flight[j].lat1,
      lon1: flight[j].lon1,
      lat2: flight[j].lat2,
      lon2: flight[j].lon2,
      randHeight: flight[j].randHeight,
      time1: flight[j].time1,
      time2: flight[j].time2,
    };
    flightGroup["flights"].push(flightProps);
  }
  flightInfo.push(flightGroup);
}

// write filtered solutions
const rankingChartString = JSON.stringify(flightInfo);
const fs = require("fs");
fs.writeFile("animatedFlights.json", rankingChartString, "utf8", (err) => {
  if (err) console.log(err);
  else {
    console.log("File written successfully\n");
    //   console.log('The written has the following contents:');
    //   console.log(fs.readFileSync('temp.json', 'utf8'));
  }
});

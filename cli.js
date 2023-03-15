#!/Users/ashams/.nvm/versions/node/v18.13.0/bin/node

import moment from 'moment-timezone';
import minimist from 'minimist';
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));
const days = args.d
const timezone = setTimeZone();
const latitude = setLatitude();
const longitude = setLongitude();

if (args.h){
	// Display the message for help 
	console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n',
       '    -h            Show this help message and exit.\n',
       '    -n, -s        Latitude: N positive; S negative.\n',
       '    -e, -w        Longitude: E positive; W negative.\n',
       '    -z            Time zone: uses tz.guess() from moment-timezone by default.\n',
       '    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n',
       '    -j            Echo pretty JSON from open-meteo API and exit.\n')
       process.exit(0)
}


// Initialize the parameters to be used in the API URL

function setTimeZone() {
    if (args.z != null) {
        return args.z
    } else {
        return moment.tz.guess();
    }
}
function setLatitude() {
    let lat
    if (args.n != null) {
        lat = args.n
    } else {
        lat = args.z * -1
    }
    lat = lat.toFixed(2)
    return lat
}
function setLongitude() {
    let long
    if (args.e != null) {
        long = args.e
    } else {
        long = args.w * -1
    }
    long = long.toFixed(2)
    return long
}

const response = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_hours&current_weather=true&timezone=${timezone}`
);
const data = await response.json();

if (args.j) {
    console.log(data)
    process.exit(0)
}

// Find the exact hours that it will rain
const precip = data.daily.precipitation_hours[days]

if (precip != 0) {
    process.stdout.write("You might need your galoshes ")
} else {
    process.stdout.write("You will not need your galoshes ")
}

if (days == 0) {
    process.stdout.write("today.")
  } else if (days > 1) {
    process.stdout.write("in " + days + " days.")
  } else {
    process.stdout.write("tomorrow.")
  }


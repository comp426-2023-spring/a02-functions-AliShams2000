#!/usr/bin/env node

import moment from 'moment-timezone';
import minimist from 'minimist';
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));

if (args.h){
	// Display the message for help 
	console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
           -h            Show this help message and exit.
           -n, -s        Latitude: N positive; S negative.
           -e, -w        Longitude: E positive; W negative.
           -z            Time zone: uses tz.guess() from moment-timezone by default.
           -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
           -j            Echo pretty JSON from open-meteo API and exit.`);
       process.exit(0)
}


const timezone = moment.tz.guess();

// Set latitude and longitude
const latitude = args.n || args.s * -1;
const longitude = args.e || args.w * -1;

// Make a request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=weathercode,temperature_2m_max,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=' + timezone);

const data = await response.json();

if (args.j) {
	console.log(data);
	process.exit(0);
}

let days;
if (args.d == null) {
	days = 1;
} else {
	days = args.d;
}

let rain = "";
if (data.daily.precipitation_hours[days] > 0) {
	rain += "You might need your galoshes ";
} else {
	rain += "You will not need your galoshes ";
}

if (days == 0) {
	rain += "today";
} else if (days > 1) {
	rain += "in " + days + " days.";
} else {
	rain += "tomorrow.";
}

console.log(rain);


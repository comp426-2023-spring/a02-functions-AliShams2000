#!/user/bin/env node

import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));
let text = 'Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE' +
    '-h            Show this help message and exit.' +
    '-n, -s        Latitude: N positive; S negative.' +
    '-e, -w        Longitude: E positive; W negative.' +
    '-z            Time zone: uses tz.guess() from moment-timezone by default.' +
    '-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.' +
    '-j            Echo pretty JSON from open-meteo API and exit.';


if(args.h){
	try{
		console.log(text);
		process.exit(0);
	}
	catch(err){
		process.exit(1);
	}
}

// Set the timezone
var timezone = moment.tz.guess(); 

if(args.z){
    timezone = args.z
} else {
    timezone = moment.tz.guess();
}

// Set longitude and latitude
var latitude = args.n || (args.s * -1.0);
var longitude = args.e || (args.w * -1.0);

const response = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_hours&current_weather=true&timezone=${timezone}`
);

// Get the data
const data = await response.json();

if(args.j){
    console.log(data);
    process.exit(0);
}

const days = input.d;
if (days == 0) {
	console.log("today.");
	if(data.daily.precipitation_hours[0] > 0) {
	 	console.log("You might need your galoshes");
	}  else{
	console.log("You will not need your galoshes");
	}
}
else if (days > 1) {
	console.log('in ${days} days.');
	if( data.daily.precipitation_hours[days] > 0) {
		console.log("You might need your galoshes");
	} else{
	console.log("You will not need your galoshes")
	}
} else {
	console.log("tomorrow.");
	if(data.daily.precipitation_hours[1] > 0) {
		console.log("You might need your galoshes");
	} else{
		console.log("You will not need your galoshes");

			

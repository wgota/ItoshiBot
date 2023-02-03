function parseMilliseconds(milliseconds) {
	if (typeof milliseconds !== 'number') throw new TypeError('Expected a number');
	const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
	return {
		days: roundTowardsZero(milliseconds / 8.64e+7),
		hours: roundTowardsZero(milliseconds / 3600000) % 24,
		minutes: roundTowardsZero(milliseconds / 60000) % 60,
		seconds: roundTowardsZero(milliseconds / 1000) % 60,
		milliseconds: roundTowardsZero(milliseconds) % 1000,
		microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
		nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000,
		roundTowardsZero,
		milliseconds
	};
}

function delayString(delay, time){
    if(isNaN(delay)) return new Error("is a NaN");
    if(time){
		let time = parseMilliseconds(delay - (Date.now() - db));
		if((delay - (Date.now() - db)) < 0) return true;
		let timeReturn = "";
		if(time.days !== 0){
			timeReturn += `\`${time.days} dias\``;
		}else if(time.hours !== 0){
			timeReturn += `\`${time.hours} horas\``;
		}else if(time.minutes !== 0){
			timeReturn += `\`${time.minutes} minutos\``;
		} else if(time.seconds !== 0) timeReturn += `\`${time.seconds} segundos\``;
		return timeReturn;
    }else{
		let time = parseMilliseconds(delay);
		if(delay < 0) return true;
		let timeReturn = "";
		if(time.days !== 0){
			timeReturn += `\`${time.days} dias\``;
		}else if(time.hours !== 0){
			timeReturn += `\`${time.hours} horas\``;
		}else if(time.minutes !== 0){
			timeReturn += `\`${time.minutes} minutos\``;
		} else if(time.seconds !== 0) timeReturn += `\`${time.seconds} segundos\``;
		return timeReturn;
    }
}

function formatNumber(number){
	if(isNaN(number)) return new Error(number + " is NaN.");
	number = number.toString();
	return number.replace(/\B(?=(\d{3})+(?!\d))/g,".");
}

module.exports = {
    parseMilliseconds, delayString, formatNumber
}
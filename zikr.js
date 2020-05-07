const timeBody = document.querySelector('.time');
const day = document.querySelector('.date');
const body = document.querySelector('#bg');

function time() {
	const hour = new Date().getHours();
	const min = new Date().getMinutes();
	const sec = new Date().getSeconds();

	timeBody.innerHTML = `
        <h1>${
					hour > 12
						? hour % 12 < 10
							? '0' + (hour % 12)
							: hour % 12
						: hour === 0
						? '12'
						: hour < 10
						? '0' + hour
						: hour
				}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}</h1>
        <span>${hour >= 12 ? 'pm' : 'am'}</span>
    `;
}

function today() {
	const today = new Date().getDay();
	const toDate = new Date().getDate();
	const month = new Date().getMonth();
	const year = new Date().getFullYear();

	const week = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	let dayText = '';
	let thisMonth = '';

	for (i = 0; i <= today; i++) {
		dayText = '';
		dayText = week[i];
	}

	for (i = 0; i <= month; i++) {
		thisMonth = '';
		thisMonth = months[i];
	}

	day.innerHTML = `
        <p>${dayText}, ${thisMonth} ${toDate}, ${year}</p>
    `;
}

setInterval(time, 1000);
today();

const arabDate = document.querySelector('.arab-date');
const iftar = document.querySelector('#iftar');
const sehri = document.querySelector('#sehri');
const left = document.querySelector('#left');

const sunrise = document.querySelector('#sunrise');
const sunset = document.querySelector('#sunset');

function test() {
	fetch(
		'https://api.aladhan.com/v1/hijriCalendarByAddress?address=Sylhet%20Bangladesh&method=2'
	)
		.then((response) => response.json())
		.then((data) => {
			const now = new Date();

			for (let i = 0; i < data.data.length; i++) {
				if (data.data[i].date.gregorian.day == now.getDate()) {
					arabDate.innerHTML = `<p>${data.data[i].date.hijri.day - 1} ${
						data.data[i].date.hijri.month.en
					}, ${data.data[i].date.hijri.year}</p>`;

					let maghrib = data.data[i].timings.Maghrib.split(/[^0-9]/).splice(
						0,
						2
					);
					maghrib[0] = maghrib[0] - 12;
					maghrib = maghrib.join(':');

					iftar.innerHTML = maghrib;

					let fota = data.data[i].timings.Imsak.split(/[^0-9]/).splice(0, 2);

					if (fota[1] > 6) {
						fota[0] = fota[0];
						fota[1] = fota[1] - 6;
						warn();
					} else if (fota[1] < 6) {
						fota[0] = fota[0] - 1;
						fota[1] = fota[1] - 6 + 60;
						warn();
					}

					function warn() {
						if (
							now.getHours() == Number(fota[0]) &&
							fota[1] - now.getMinutes() < 10 &&
							fota[1] - now.getMinutes() > 0
						) {
							fota = fota.join(':');
							sehri.innerHTML = fota;
							sehri.style.color = '#f9ff21';
						} else if (
							now.getHours() == Number(fota[0]) &&
							fota[1] <= now.getMinutes() &&
							now.getMinutes() - fota[1] < 10
						) {
							sehri.innerHTML = 'Times Up!';
							sehri.style.color = '#f9ff21';
						} else {
							sehri.innerHTML = fota.join(':');
						}
					}

					sunrise.innerText = `${data.data[i].timings.Sunrise.split(/[^0-9]/)
						.splice(0, 2)
						.join(':')}`;

					let sundown = data.data[i].timings.Sunset.split(/[^0-9]/).splice(
						0,
						2
					);
					sundown[0] = sundown[0] - 12;
					sunset.innerText = `0${sundown.join(':')}`;
				}
			}
		});
}

setInterval(test, 1000);

const ayat = document.querySelector('.ayat');
const number = document.querySelector('.number');

function hadith() {
	fetch(
		`https://api.alquran.cloud/v1/ayah/${Math.floor(
			Math.random() * 6237
		)}/editions/bn.bengali`
	)
		.then((response) => response.json())
		.then((data) => {
			ayat.innerText = data.data[0].text;
			number.innerText = `${data.data[0].surah.englishName} | ${data.data[0].numberInSurah}`;
		});
}

hadith();
setInterval(hadith, 60000);

//mdn array.find;
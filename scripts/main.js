const timeBody = document.querySelector('.time');
const day = document.querySelector('.date');
const arabDate = document.querySelector('.arab-date');
const iftar = document.querySelector('#iftar');
const sehri = document.querySelector('#sehri');
const sunrise = document.querySelector('#sunrise');
const sunset = document.querySelector('#sunset');
const ayah = document.querySelector('.ayat');
const surahMetaData = document.querySelector('.surah-meta');

function time() {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();

  timeBody.innerHTML = `
        <h1>
        ${
          hour > 12
            ? hour % 12 < 10
              ? `0${hour % 12}`
              : hour % 12
            : hour === 0
            ? '12'
            : hour < 10
            ? `0${hour}`
            : hour
        }:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}
        </h1>
        <span>${hour >= 12 ? 'pm' : 'am'}</span>
    `;
}

function today() {
  const now = new Date();
  const weekDayIndex = now.getDay();
  const monthIndex = now.getMonth();

  const week = Array.from({ length: 7 }, (item, i) =>
    new Date(0, 0, i).toLocaleString('en-US', { weekday: 'long' })
  );

  const months = Array.from({ length: 12 }, (item, i) =>
    new Date(0, i).toLocaleString('en-US', { month: 'long' })
  );

  day.innerHTML = `
    <p>
      ${week[weekDayIndex]},
      ${months[monthIndex]} ${now.getDate()}, ${now.getFullYear()}
    </p>
  `;
}

setInterval(time, 1000);
today();

function warn(sehriTimeArray) {
  const now = new Date();
  if (
    now.getHours() === Number(sehriTimeArray[0]) &&
    sehriTimeArray[1] - now.getMinutes() < 10 &&
    sehriTimeArray[1] - now.getMinutes() > 0
  ) {
    const sehriText = sehriTimeArray.join(':');
    sehri.innerHTML = sehriText;
    sehri.style.color = '#f9ff21';
  } else if (
    now.getHours() === Number(sehriTimeArray[0]) &&
    sehriTimeArray[1] <= now.getMinutes() &&
    now.getMinutes() - sehriTimeArray[1] < 10
  ) {
    sehri.innerHTML = 'Times Up!';
    sehri.style.color = '#f9ff21';
  } else {
    sehri.innerHTML = sehriTimeArray.join(':');
  }
}

function main() {
  fetch(
    'https://api.aladhan.com/v1/hijriCalendarByAddress?address=Sylhet%20Bangladesh&method=2'
  )
    .then((response) => response.json())
    .then((data) => {
      const now = new Date();

      for (let i = 0; i < data.data.length; i++) {
        if (
          data.data[i].date.gregorian.day ===
          `${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}`
        ) {
          arabDate.innerHTML = `<p>${data.data[i].date.hijri.day - 1} ${
            data.data[i].date.hijri.month.en
          }, ${data.data[i].date.hijri.year}</p>`;

          let maghrib = data.data[i].timings.Maghrib.split(/[^0-9]/).splice(
            0,
            2
          );
          maghrib[0] -= 12;
          maghrib = maghrib.join(':');

          iftar.innerHTML = maghrib;

          const sehriTimeArray = data.data[i].timings.Imsak.split(
            /[^0-9]/
          ).splice(0, 2);

          setInterval(warn(sehriTimeArray), 1000);

          sunrise.innerText = `${data.data[i].timings.Sunrise.split(/[^0-9]/)
            .splice(0, 2)
            .join(':')}`;

          const sundown = data.data[i].timings.Sunset.split(/[^0-9]/).splice(
            0,
            2
          );
          sundown[0] -= 12;
          sunset.innerText = `0${sundown.join(':')}`;
        }
      }
    });
}

main();

function fetchAyah() {
  fetch(
    `https://api.alquran.cloud/v1/ayah/${Math.floor(
      Math.random() * 6237
    )}/editions/bn.bengali`
  )
    .then((response) => response.json())
    .then((data) => {
      ayah.innerText = data.data[0].text;
      surahMetaData.innerText = `${data.data[0].surah.englishName} | ${data.data[0].numberInSurah}`;
    });
}

fetchAyah();
setInterval(fetchAyah, 60000);

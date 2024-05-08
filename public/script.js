// Call dropdownProvinsi when the page loads
window.onload = function () {
  dropdownProvinsi();
  startTime();
};

function dropdownProvinsi() {
  fetch("https://kechenk.github.io/api-wilayah-indonesia/api/provinces.json")
    .then((response) => response.json())
    .then((data) => {
      var pilihProvinsi = document.getElementById("pilihProvinsi");
      data.forEach((province) => {
        var option = document.createElement("option");
        option.value = province.id;
        option.textContent = province.name;
        pilihProvinsi.appendChild(option);

        // If the province name is "Jawa Timur", select it by default
        if (province.name.toLowerCase() === "jawa timur") {
          pilihProvinsi.value = province.id;
          // After selecting "Jawa Timur", trigger city dropdown population
          dropdownKota();
        }
      });
    });
}

function dropdownKota() {
  var idProvinsi = document.getElementById("pilihProvinsi").value;
  fetch(
    `https://kechenk.github.io/api-wilayah-indonesia/api/regencies/${idProvinsi}.json`
  )
    .then((response) => response.json())
    .then((data) => {
      var pilihKota = document.getElementById("pilihKota");
      pilihKota.innerHTML = "";
      data.forEach((city) => {
        var option = document.createElement("option");
        option.value = city.id;
        option.textContent = city.name;
        pilihKota.appendChild(option);

        if (city.name.toLowerCase() === "kota surabaya") {
          pilihKota.value = city.id;
        }
      });
      pilihKota.dispatchEvent(new Event("change"));
    });
  // console.log(idProvinsi);
}

function jamSholat() {
  var pilihKota = document.getElementById("pilihKota");
  var namaKota = pilihKota.options[pilihKota.selectedIndex].text;
  var namaKotaSpace = namaKota.replace(/\s/g, "+");
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  var api = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${namaKotaSpace}&country=Indonesia&method=20`;
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      var waktuSholat = data.data;
      var hijri = data.data[0].date.hijri.year;
      var hijrimonth = data.data[0].date.hijri.month.en;
      var hijri1 = data.data[29].date.hijri.year;
      var hijrimonth1 = data.data[29].date.hijri.month.en;
      var timezone = GMT(data.data[0].meta.timezone);
      var monthYear = `${monthNames[month - 1]} - ${year}`;
      // document.getElementById("city").innerText = namaKota;
      document.getElementById("city1").innerText = namaKota;
      document.getElementById("hijri").innerText = hijri;
      document.getElementById("hijri1").innerText = hijri1;
      document.getElementById("hijrimonth").innerText = hijrimonth;
      document.getElementById("hijrimonth1").innerText = "/ " + hijrimonth1;
      document.getElementById("timezone").innerText = timezone;
      // document.getElementById("month-year").innerText = monthYear;
      document.getElementById("month-year1").innerText = monthYear;
      var table = document.querySelector(".data_sholat1");
      table.innerHTML = "";
      displayWaktuSholat(waktuSholat);
      // displayTime();
    });
  console.log(displayWaktuSholat);
}

function GMT(timezone) {
  switch (timezone) {
    case "Asia/Jakarta":
      return "GMT+7";
    case "Asia/Makassar":
      return "GMT+8";
    case "Asia/Jayapura":
      return "GMT+9";
    default:
      return timezone;
  }
}

function displayZonaWaktu(timezone) {
  var zonaWaktuElement = document.getElementById("zonaWaktu");
  zonaWaktuElement.innerText = timezone;
  console.log(displayZonaWaktu);
}

function displayWaktuSholat(waktuSholat) {
  var table = document.querySelector(".data_sholat1");
  table.innerHTML = "";
  var today = new Date().getDate();
  waktuSholat.forEach((day, index) => {
    var row = document.createElement("tr");
    var className = index % 2 === 0 ? "table_dark" : "table_light";
    if (index + 1 === today) {
      className = "table_highlight";
    }
    row.className = "table_row " + className;

    // Remove timezone abbreviations from the timings
    const timezone = (time) => time.replace(/\s\(.*\)/, "");

    row.innerHTML = `
    <td>
        <span>${day.date.gregorian.day}</span>
        <small class="hijri-date-text">${day.date.hijri.day} ${
      day.date.hijri.month.en
    }
        </small>
        <div class="hidden print:block">${day.date.hijri.day} ${
      day.date.hijri.month.en
    }
        <div>
    </td>
    <td>${timezone(day.timings.Imsak)}</td>
    <td><b>${timezone(day.timings.Fajr)}</b></td>
    <td>${timezone(day.timings.Sunrise)}</td>
    <td>${timezone(day.timings.Dhuhr)}</td>
    <td>${timezone(day.timings.Asr)}</td>
    <td><b>${timezone(day.timings.Maghrib)}</b></td>
    <td>${timezone(day.timings.Isha)}</td>
    `;
    table.appendChild(row);
  });
}

function fetchQuranVerse(verseNumber) {
  // Construct the API URL
  const apiUrl = `https://web-api.qurankemenag.net/quran-ayah/${verseNumber}`;

  // Fetch the data
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract the verse content
      const verseContent = data.data.arabic;
      const translate = data.data.translation;
      const ayah = data.data.surah.arabic;
      const surah = data.data.surah_id;
      const juz = data.data.juz;
      const ayahNum = data.data.surah.num_ayah;
      const latin = data.data.surah.latin;
      const bahasa = data.data.surah.translation;

      // Display the verse on the webpage
      document.getElementById("quran").innerHTML = verseContent;
      document.getElementById("translate").innerHTML = translate;
      document.getElementById("bahasa").innerHTML = bahasa;
      document.getElementById("ayah").innerHTML = ayah;
      document.getElementById("ayahnum").innerHTML = ayahNum;
      document.getElementById("latin").innerHTML = latin;
      document.getElementById("surah-id").innerHTML = "QS : " + surah + "||";
      document.getElementById("juz").innerHTML = " JUZ : " + juz;
    });
}

// Generate a random verse number between 1 and 6236
const verseNumber = Math.floor(Math.random() * 6236) + 1;

// Call the function with the randomly generated verse number
fetchQuranVerse(verseNumber);

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  // add a zero in front of numbers<10
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("time").innerHTML = h + ":" + m + ":" + s;
  t = setTimeout(function () {
    startTime();
  }, 500);
}
startTime();

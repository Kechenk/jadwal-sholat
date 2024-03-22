function autoFillSurabaya() {
  // Fetch the list of provinces
  fetch("https://kechenk.github.io/api-wilayah-indonesia/api/provinces.json")
    .then((response) => response.json())
    .then((data) => {
      // Find Surabaya's province ID (which is 31) and select it
      var pilihProvinsi = document.getElementById("pilihProvinsi");
      var surabayaProvince = data.find((province) => province.id === "35");
      pilihProvinsi.value = surabayaProvince.id;

      // Fetch the list of cities in Surabaya's province
      fetch(
        `https://kechenk.github.io/api-wilayah-indonesia/api/regencies/${surabayaProvince.id}.json`
      )
        .then((response) => response.json())
        .then((cityData) => {
          // Find Surabaya's city ID (which is 3174) and select it
          var pilihKota = document.getElementById("pilihKota");
          var surabayaCity = cityData.find((city) => city.id === "3578");
          pilihKota.value = surabayaCity.id;

          // Trigger the 'change' event on the cities dropdown to populate the data for Surabaya
          pilihKota.dispatchEvent(new Event("change"));
        })
        .catch((error) => console.error("Error fetching cities", error));
    })
    .catch((error) => console.error("Error fetching provinces", error));
}

// Call the autoFillSurabaya function to automatically fill the province and city with Surabaya
autoFillSurabaya();

function dropdownProvinsi() {
  fetch("https://kechenk.github.io/api-wilayah-indonesia/api/provinces.json")
    .then((response) => response.json())
    .then((data) => {
      var pilihProvinsi = document.getElementById("pilihProvinsi");
      data.forEach((provinces) => {
        var option = document.createElement("option");
        option.value = provinces.id;
        option.textContent = provinces.name;
        pilihProvinsi.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching provinces", error));
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
      });
      pilihKota.dispatchEvent(new Event("change"));
    });
  console.log(idProvinsi);
}

function jamSholat() {
  var pilihKota = document.getElementById("pilihKota");
  var namaKota = pilihKota.options[pilihKota.selectedIndex].text;
  var namaKotaSpace = namaKota.replace(/\s/g, '');
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
      var monthYear = `${monthNames[month - 1]} - ${year}`;
      document.getElementById("city").innerText = namaKota;
      document.getElementById("city1").innerText = namaKota;
      document.getElementById("month-year").innerText = monthYear;
      document.getElementById("month-year1").innerText = monthYear;
      var table = document.querySelector(".data_sholat");
      table.innerHTML = "";
      displayWaktuSholat(waktuSholat);
      displayTime();
    });
  console.log(namaKotaSpace)
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
      const timezone = (time) => time.replace(/\s\(.*\)/, '');
  
      row.innerHTML = `
        <td>${day.date.gregorian.day}
        <small class="hijri-date-text">${day.date.hijri.day} ${day.date.hijri.month.en}</small></td>
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
  
dropdownProvinsi();

function printPage() {
  window.print();
}

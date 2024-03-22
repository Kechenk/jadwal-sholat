function jamSholat() {
  var pilihKota = document.getElementById("pilihKota");
  var namaKota = pilihKota.options[pilihKota.selectedIndex].text;
  var api = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${namaKota}&country=Indonesia&method=20`;
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      var waktuSholat = data.data;
      var monthYear = `${monthNames[month - 1]} - ${year}`;
      document.getElementById("city").innerText = namaKota;
      document.getElementById("month_year").innerText = monthYear;
      var table = document.querySelector(".data_sholat");
      table.innerHTML = "";
      displayWaktuSholat(waktuSholat);
      displayTime();
    });
  console.log(namaKota);
}

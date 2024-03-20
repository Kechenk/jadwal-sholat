$('.town-select').select2();

        $('.town-select').change(function () {
            const currParam = new URLSearchParams(window.location.search);
            const currLocation = window.location.href.split('?')[0];

            currParam.set('id', this.value);
            localStorage.setItem('location_id', this.value);

            window.location.href = `${currLocation}?${currParam.toString()}`;
        });
const refs = {
  googleMapsScript: document.querySelector('#googleMaps'),
  mapsBtnList: document.querySelector('.maps-buttons'),
  searchInput: document.querySelector('.search__input'),
};
let geocoder;
let map;

const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    refs.googleMapsScript.onload = () => resolve();
    refs.googleMapsScript.onerror = () => reject();
  });
};

async function initialize() {
  await loadGoogleMaps();

  geocoder = new google.maps.Geocoder();
  const latlng = new google.maps.LatLng(47.563, 24.113);
  const mapOptions = {
    zoom: 2,
    center: latlng,
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  addEventListenersOnButtons();
}

function addEventListenersOnButtons() {
  refs.mapsBtnList.addEventListener('click', ({ target }) => {
    map.overlayMapTypes.pop();

    if (target.dataset.layer === 'remove') {
      return;
    }

    addRadar(target.dataset.layer, '50');
  });
}

function addRadar(layer, opacity) {
  const radar = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
      return [
        `https://maps.aerisapi.com/GrAzy4MYDmdT7vTgRDBkx_NRWKJNNZ7xqGXjwqmiCYsVhji3eOH9Jg31vpUS6p/${layer}:${opacity}/`,
        zoom,
        '/',
        coord.x,
        '/',
        coord.y,
        '/current.png',
      ].join('');
    },
    tileSize: new google.maps.Size(256, 256),
  });

  map.overlayMapTypes.push(radar);
}

function codeAddress(e) {
  e.preventDefault();
  const address = refs.searchInput.value;
  map.zoom = 7;

  geocoder.geocode({ address }, function (results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      const marker = new google.maps.Marker({
        map,
        position: results[0].geometry.location,
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

initialize();

refs.searchInput.addEventListener('change', codeAddress);

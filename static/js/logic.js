// load the data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(data => {
    // create the map
    const map = L.map('map').setView([37.8, -96], 4);

    // add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // define a function to get the color based on the depth of the earthquake
    const getColor = depth => {
      if (depth > 90) return '#FF0000';
      if (depth > 70) return '#FF6600';
      if (depth > 50) return '#FFCC00';
      if (depth > 30) return '#FFFF00';
      if (depth > 10) return '#CCFF00';
      return '#00FF00';
    };

    // define a function to get the radius based on the magnitude of the earthquake
    const getRadius = magnitude => magnitude * 4;

    // add a circle marker for each earthquake
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];
      L.circleMarker([coordinates[1], coordinates[0]], {
        color: getColor(depth),
        fillColor: getColor(depth),
        fillOpacity: 0.8,
        radius: getRadius(magnitude)
      })
        .bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}</p><p>Depth: ${depth} km</p>`)
        .addTo(map);
    });

    // add a legend to the map
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [-10, 10, 30, 50, 70, 90];
      let labels = [];
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(map);
  });


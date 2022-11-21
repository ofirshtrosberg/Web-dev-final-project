async function GetMap() {
    const response = await fetch('/stores/markers');
    const markers = await response.json()
    var map = new Microsoft.Maps.Map(document.getElementById("myMap"), {
        credentials: "AjaUQTqkcz772cSbiXR-cJffY3tTwoog3BCo3TvvI8WgHdJBjHuwDdTp1uSG-nuI",
        center: new Microsoft.Maps.Location(32.106038, 34.805205),
        zoom: 2,
    });

    var center = map.getCenter();

    let points = []
    for (let i = 0; i < markers.length; i++) {
        let newPoint = new Microsoft.Maps.Location(markers[i].location.lat, markers[i].location.lon)
        points.push(newPoint)
    }

    for (let i = 0; i < points.length; i++) {
        var pin = new Microsoft.Maps.Pushpin(points[i], {
            color: '#9e6c77'
        });
        map.entities.push(pin);

    }
    const bounds = Microsoft.Maps.LocationRect.fromLocations(points)
    map.setView({bounds: bounds})
}

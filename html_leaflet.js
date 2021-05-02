const html_script = `
<!DOCTYPE html>
<html>
<head>
	
	<title>Quick Start - Leaflet</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="initial-scale=1.0">
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
	<link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
	<script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
	<script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
</head>
<body style="padding: 0; margin: 0">
<div id="mapid" style="width: 100%; height: 100vh;"></div>
<script>
let mymap = L.map('mapid').setView([51.505, -0.09], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

	
</script>
</body>
</html>
`

export default html_script
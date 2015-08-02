// read in our routes from a comma-separated file
var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'examples','route.csv');
var csv = f.read();
var points = [];
var lines = csv.toString().split("\n");
for (var c=0;c<lines.length;c++)
{
	var line = lines[c];
	var latlong = line.split(",");
	if (latlong.length > 1)
	{
		var lat = latlong[0];
		var lon = latlong[1];
		var entry = {latitude:lat,longitude:lon};
		points[c]=entry;
	}
}
var ratio = 8;
var server = "http://localhost/visu/";
var firstLayer = project.activeLayer;
var layers = [];
var days = ['', 'Vendredi', 'Samedi', 'Dimanche'];
var animatePath = null;
var animatePoints = [];


function getData(day)
{
	var XHR = new XMLHttpRequest();
	XHR.onreadystatechange = function () {
		if (XHR.readyState == 4 && (XHR.status == 200 || XHR.status == 0))
		{
			var result = JSON.parse(XHR.responseText);
			layers[day] = new Layer();
			drawHeat(result.map, result.max, day);
		}
	};
	XHR.open("GET", server + "php/heatMap.php?day=" + day, true);
	XHR.send(null);
}

function drawHeat(coordinates, maxHeat, day)
{
	var text = new PointText(
			{
				point: new Point(10, 30),
				content: days[day],
				fillColor: 'red',
				fontWeight: 'bold',
				fontSize: 25
			}
	);
	for (var i in coordinates)
	{
		for (var j in coordinates[i])
		{
			var x = i * ratio;
			var y = (100 - j) * ratio - 8;
			var point = new Point(x, y);
			var rect = new Rectangle(point + [-3, -3], point + [3, 3])
			var myPath = new Path.Rectangle(rect);
			myPath.fillColor = new Color(1, 1 - coordinates[i][j] * 1 / maxHeat, 1);
			myPath.strokeColor = new Color(1, 1 - coordinates[i][j] * 1 / maxHeat, 1);
			myPath.data = coordinates[i][j];
			myPath.onClick = function () {
				alert("Ce point a été enregistré " + this.data + " fois le jour " + days[day]);
			};
			myPath.onMouseEnter = function () {
				document.getElementById("datainfo").innerHTML = "Ce point a été enregistré " + this.data + " fois le " + days[day];
			};
		}
	}
	project.activeLayer.visible = false;
	if (day < 3)
		getData(day + 1);
}

function drawPerson(result, id)
{
	for (var i in layers)
		layers[i].visible = false;
	firstLayer.activate();
	project.activeLayer.visible = true;
	project.activeLayer.removeChildren();
	animatePath = null;
	animatePoints = [];

	console.log(id);
	var text = new PointText(
			{
				point: new Point(10, 30),
				content: id,
				fillColor: 'red',
				fontWeight: 'bold',
				fontSize: 25
			}
	);
	for (var k in result)
	{
		var i = result[k].x;
		var j = result[k].y;
		var x = i * ratio;
		var y = (100 - j) * ratio - 8;
		var point = new Point(x, y);
		if (animatePath == null)
		{
			animatePath = new Path({
				segments: [point],
				strokeColor: 'black',
				fullySelected: true
			});
		} else
			animatePoints.push(point);
		var rect = new Rectangle(point + [-3, -3], point + [3, 3])
		var myPath = new Path.Rectangle(rect);
		myPath.fillColor = '#ffffff';
		myPath.strokeColor = '#1A8DD4';
		myPath.data = result[k];
		myPath.onClick = function () {
			alert(this.data);
		};
		myPath.onMouseEnter = function () {
			document.getElementById("datainfo").innerHTML = "Ce " + this.data.type + " a été enregistré le " + this.data.date + " sur le point {x:" + this.data.x + ",y:" + this.data.y + "}";
		};
	}
	project.view.update(true);

}

paper.tools.getID = function (id)
{
	var XHR = new XMLHttpRequest();
	XHR.onreadystatechange = function () {
		if (XHR.readyState == 4 && (XHR.status == 200 || XHR.status == 0))
		{
			var result = JSON.parse(XHR.responseText);
			drawPerson(result, id);
		}
	};
	XHR.open("GET", server + "php/CheminID.php?id=" + id, true);
	XHR.send(null);

}

paper.tools.promptID = function ()
{
	var id = parseInt(window.prompt("ID de la personne que vous souhaitez tracker", 657863));
	if (id !== 0)
	{
		paper.tools.getID(id);
	}
}


paper.tools.displayDay = function (day)
{
	firstLayer.visible = false;
	for (var i in layers)
		layers[i].visible = false;
	layers[day].visible = true;
	project.view.update(true);
};


function onFrame(event) {
	if (animatePoints.length > 0)
	{
		animatePath.add(animatePoints.shift());
	}
}

getData(1);
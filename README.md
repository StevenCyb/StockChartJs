# StockChartJs
A lightweight stock chart library for js.
To use it, only one file needs to be included -
```
<script src="./stockchart.js"></script>
```
The `demo.html` (see figure at the end) contains a few examples.
```javascript
// Create a StockChartJs object with required configuration (the following values are the standard)
var obj = new StockChartJs(document.getElementById(canvasElementId), {
	data: [],				// Data can be preseted or pushed as soon as they are available
	limit: 20,				// Maximum number of points in the chart
	reversed: false,			// Should the data come from left to right (false) or right to left (true)
	scale: 4,				// Scaling parameter to change the DPI (better not to change it)
	info: true,				// Display min-, max- and avg-value of holded data points 
	info_font: "40px Arial",		// Font of the information
	info_color: "#333333",			// Color of the information
	padding: {				// Padding inside the canvas 
		top: 45,
		bottom: 35,
		left: 40,
		right: 40
	},
	series: { 				// Line color and width of the stock
		color: "#333333",
		width: 5
	},
	index_dots: {				// Dots to mark an index (style attributes are obvious)
		indexes: [],			// Array of indexes (index of datapoint array)
		radius: 10,				
		color: "#333333",		
		border: 0,
		border_color: "#000000"
	},
	x_lines: {				// Lines in the x-axis to make logical separations (style attributes are obvious)
		positions: [],			// Array of positions (Normalized between 0.0 and 1.0)
		color: "#aaaaaa",
		width: 3
	},
	y_lines: {				// Lines in the y-axis to make logical separations (style attributes are obvious)
		positions: [],			// Array of positions (Normalized between 0.0 and 1.0)
		color: "#aaaaaa",
		width: 3
	}
})
// Add some sample data (in this case sin)
for(var i=0; i<20; i++) {
	obj.push(Math.sin((x / 10) * Math.PI));
}
```
![Demo](/demo.gif)

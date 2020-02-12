

var color = d3.scaleOrdinal()
    .domain(["Пригоди й інциденти", "Рада", "зе і путін в норманції", "Гроші", "війна", "обміни полоненими", "ринок землі", "Газ"])
    .range(["grey", "red", '#69c242', '#64bbe3', 'orange', '#ff7300', 'magenta', "blue"]);



const f = function(data) {

    var height;

    const width = window.innerWidth * 0.98;
    const margin = {top: 0, right: 0, bottom: 0, left: 0};
    if(screen.width <= 812){
        height = screen.height * 3;
    } else {
        height = window.innerHeight * 0.98;
    }


    //щоб потім перемалювати в канвас
    var canvas = d3.select("#chart").append("canvas")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var context = canvas.node().getContext("2d");

    data = {name: 'root', children: data};
    
    const root = d3.hierarchy(data, function(d){return d.children })
        .sum(function(d) { return d.value })
        .sort(function(a, b) { return a.value > b.value ? -1 : 1 });

    const treemap = d3.treemap()
        .tile(d3.treemapBinary)
        .size([width, height])
        .padding(0)
        (root);

    console.log(treemap.descendants());

    const svg = d3.select('body')
        .append('svg')
        .attr("xmlns", "http://www.w3.org/2000/svg")  //ця штука потрібна, щоб перетворити на канвас
        .attr("id", "treemap")
        .attr('width', width)
        .attr('height', height)
        // .style("background-color", "black")
        ;

    var container = svg.append("g").attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // svg.call(
    //     d3.zoom()
    //         .scaleExtent([1, 25])
    //         .on("zoom", redraw)
    // );
    //
    // function redraw() {
    //     container.attr("transform", d3.event.transform);
    // }


  var nodes = container.selectAll('div')
      .data(treemap.descendants().filter(function(d){
              return d.height == 1 }))
      .enter()
      .append('g')
      .attr("id", function(d,i) { return "num_"+ i})
      .attr("transform", function(d) { return "translate(" +  d.x0 +", " + d.y0 +" )" })
      // .attr('x', function(d) { return d.x0 })
      // .attr('y', function(d) { return d.y0 })
      .attr('width', function(d) { return d.x1 - d.x0 })
      .attr('height',function(d) { return d.y1 - d.y0 })
      .attr("value", function(d) { return d.data.name });

    nodes.append('text')
        .attr('x',  function(d) {
            var topicLen = d.data.name.length;
            return ((d.x1 - d.x0) - (topicLen * 5)) / 2; //умовно 5px на одну літеру
        })
        .attr('y', '18px')
        .text(function(d) {
            return d.data.name;
        })
        // .call(wrap, 100)
        .style("fill", function(d) {
                return color(d.data.name);
            })
        .style("text-transform", "lowercase")
        .style("letter-spacing", "1px")
        .style("font-size", "14px")
        .style("font-family", "Alegreya Sans SC, sans-serif")
        .style("font-weight", "bold")
       ;

    //  викликаємо функцію, яка малює скатерплоти в кожен блок трімапу
    nodes
      .datum(function(d) {
          return d.children })
      .call(scatter());


    /* перемальовуємо в канвас, спосіб звідси: http://bl.ocks.org/armollica/99f18720eb9762351febd64236bb1b9e*/

    var DOMURL = window.URL || window.webkitURL || window;
    var svgString = domNodeToString(svg.node());

    var image = new Image();
    var svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    var url = DOMURL.createObjectURL(svgBlob);

    image.onload = function() {
        context.drawImage(image, 0, 0);
        DOMURL.revokeObjectURL(url);
    };

    image.src = url;


    /* додаємо зум */
    canvas
        .call(d3.zoom()
        .scaleExtent([1, 17])
        .on("zoom", zoom));


    function zoom() {
        var transform = d3.event.transform;
        context.save();
        context.clearRect(0, 0, width, height);
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);
        context.drawImage(image, 0, 0);
        context.restore();
    }


};


d3.json('data.json').then(f);



function processRow(d) {
    d.frequency = +d.frequency;
    return d;
}

// Get the string representation of a DOM node (removes the node)
function domNodeToString(domNode) {
    var element = document.createElement("div");
    element.appendChild(domNode);
    return element.innerHTML;
}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                // .style("font-size", "1.5px")
                .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    // .style("font-size", "1.5px")
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}
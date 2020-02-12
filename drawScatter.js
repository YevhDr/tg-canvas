const scatter = function(){

    function chart(selection) {
        selection.each(function (data) {

        var div = d3.select(this);

        var w = div.attr('width');
        var h = div.attr('height');

        var topic =  div.attr('value');
        console.log(topic);

            // div.append("rect")
            // .style('fill', 'none')
            // .style('stroke', 'lightgrey')
            // .attr('x', 0)
            // .attr('y', 0)
            // .attr('width', "100%")
            // .attr('height', "100%");


        var containerInner = div
            .append("g")
            .attr('width', w)
            .attr('height', h)
            .attr("transform", "translate(0, 0)");

        var xMax = d3.max(data, function (d) {
            return +d.data.umap_cl_x;
        });

        var yMax = d3.max(data, function (d) {
            return +d.data.umap_cl_y;
        });

        var x = d3.scaleLinear()
            .domain([-1, xMax+1])
            .range([0, w]);


        var y = d3.scaleLinear()
            .domain([-1, yMax+1])
            .range([h, 0]);


        var simulation = d3.forceSimulation(data)
            .force("x", d3.forceX(function (d) {
                return x(d.data.umap_cl_x);
            }))
            .force("y", d3.forceY(function (d) {
                return y(d.data.umap_cl_y);
            }))
            .force("collide", d3.forceCollide(10)
                .strength(1)
                .iterations(2))
            .stop();


            for (var i = 0; i < 120; ++i) simulation.tick();

            // containerInner
            //     .selectAll(".dot")
            //     .data(data)
            //     .enter()
            //     .append('svg:foreignObject')
            //     .attr('height', '15px')
            //     .attr('width', '15px')
            //     .html('<i class="fab fa-telegram-plane"></i>')
            //     .attr("x", function (d) {
            //         return d.x;
            //     })
            //     .attr("y", function (d) {
            //             return d.y;
            //         })
            //     .attr("r", 5);
            //

           //  containerInner
           //      .selectAll(".dot")
           //      .data(data)
           //      .enter()
           //      .append('circle')
           //      .attr("cx", function (d) {
           //          return x(d.data.umap_cl_x);
           //      })
           //      .attr("cy", function (d) {
           //          return y(d.data.umap_cl_y);
           //      })
           //      .attr("r", 3)
           //      .style("fill", "black")
           //      .style("opacity", 0.2)
           // ;

            containerInner
                .selectAll("text")
                .data(data)
                .enter()
                .append("text")
                // .attr("x", function (d) {
                //     return x(d.data.umap_cl_x);
                // })
                // .attr("y", function (d) {
                //     return  y(d.data.umap_cl_y);
                // })
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .text(function (d) {
                    return d.data.name
                })
                .style("fill", color(topic))
                .style("font-size", "1.5px")
                .call(wrap, 15)
                .on("click", function(){
                    alert("hi")
                });

        })
    }

    return chart;
};






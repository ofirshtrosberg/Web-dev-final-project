$(() => {
  function sortFunctionGraph1(date1, date2) {
    const date1Split = date1.split('/');
    const date1Month = date1Split[0];
    const date1Year = date1Split[1];
    const date2Split = date2.split('/');
    const date2Month = date2Split[0];
    const date2Year = date2Split[1];
    if (date1Month == date2Month && date1Year == date2Year) {
      return 0;
    }
    else if (date1Year > date2Year) {
      return 1;
    }
    else if (date1Year < date2Year) {
      return -1;
    }
    // year is equal
    else if (date1Month > date2Month) {
      return 1;
    }
    else {
      return -1;
    }
  }
  function sortFunctionGraph2(a, b) {
    return a < b ? -1 : (a > b ? 1 : 0);
  }
  $.ajax({
    url: "http://localhost:8088/orders/detailsForGraphs",
  }).done(function (graphsDetails) {

    var ordersGraph1 = graphsDetails[0];
    var ordersGraph2 = graphsDetails[1];
    var fixedDataGraph1 = [];
    for (let i = 0; i < ordersGraph1.length; i++) {
      const ordersPerMonth = ordersGraph1[i];
      const price = ordersPerMonth.ordersPriceForMonth;
      const date = ordersPerMonth._id.month + "/" + ordersPerMonth._id.year;
      const fixedOrdersPerMonth = { date: date, price: price };
      fixedDataGraph1.push(fixedOrdersPerMonth);
    }

    const graphWidth = 700;
    const graphHeight = 310;
    // graph1:
    const xScaleGraph1 = d3
      .scaleBand()
      .rangeRound([0, graphWidth])
      .padding(0.1)
      .domain(
        fixedDataGraph1.map((ordersGraph1PerMonth) => ordersGraph1PerMonth.date).sort(sortFunctionGraph1)
      );

    const yScaleGraph1 = d3
      .scaleLinear()
      .range([graphHeight, 0])
      .domain([
        0,
        d3.max(
          fixedDataGraph1,
          (ordersGraph1PerMonth) => ordersGraph1PerMonth.price
        ) + 50,
      ]);

    const graph1SVG = d3.select("#graph1SVG");

    const graph1Elements = graph1SVG.append("g");

    // x axis
    graph1Elements
      .append("g")
      .call(d3.axisBottom(xScaleGraph1).tickSizeOuter(0))
      .attr("transform", `translate(0,${graphHeight})`);

    graph1Elements
      .selectAll(".bar")
      .data(fixedDataGraph1)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("width", xScaleGraph1.bandwidth())
      .attr(
        "height",
        (ordersGraph1PerMonth) =>
          graphHeight - yScaleGraph1(ordersGraph1PerMonth.price)
      )
      .attr("x", (ordersGraph1PerMonth) =>
        xScaleGraph1(ordersGraph1PerMonth.date)
      )
      .attr("y", (ordersGraph1PerMonth) =>
        yScaleGraph1(ordersGraph1PerMonth.price)
      );

    graph1Elements
      .selectAll("label")
      .data(fixedDataGraph1)
      .enter()
      .append("text")
      .text((ordersGraph1PerMonth) => ordersGraph1PerMonth.price)
      .attr(
        "x",
        (ordersGraph1PerMonth) =>
          xScaleGraph1(ordersGraph1PerMonth.date) + xScaleGraph1.bandwidth() / 2
      )
      .attr(
        "y",
        (ordersGraph1PerMonth) => yScaleGraph1(ordersGraph1PerMonth.price) - 15
      )
      .attr("text-anchor", "middle");

    //graph2:
    const xScaleGraph2 = d3
      .scaleBand()
      .rangeRound([0, graphWidth])
      .padding(0.1)
      .domain(
        ordersGraph2.map((ordersGraph2PerYear) => ordersGraph2PerYear._id.year).sort(sortFunctionGraph2)
      );

    const yScaleGraph2 = d3
      .scaleLinear()
      .range([graphHeight, 0])
      .domain([
        0,
        d3.max(
          ordersGraph2,
          (ordersGraph2PerYear) => ordersGraph2PerYear.ordersPriceForYear
        ) + 50,
      ]);

    const graph2SVG = d3.select("#graph2SVG");

    const graph2Elements = graph2SVG.append("g");
    // x axis
    graph2Elements
      .append("g")
      .call(d3.axisBottom(xScaleGraph2).tickSizeOuter(0))
      .attr("transform", `translate(0,${graphHeight})`);

    graph2Elements
      .selectAll(".bar")
      .data(ordersGraph2)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("width", xScaleGraph2.bandwidth())
      .attr(
        "height",
        (ordersGraph2PerYear) =>
          graphHeight - yScaleGraph2(ordersGraph2PerYear.ordersPriceForYear)
      )
      .attr("x", (ordersGraph2PerYear) =>
        xScaleGraph2(ordersGraph2PerYear._id.year)
      )
      .attr("y", (ordersGraph2PerYear) =>
        yScaleGraph2(ordersGraph2PerYear.ordersPriceForYear)
      );

    graph2Elements
      .selectAll("label")
      .data(ordersGraph2)
      .enter()
      .append("text")
      .text((ordersGraph2PerYear) => ordersGraph2PerYear.ordersPriceForYear)
      .attr(
        "x",
        (ordersGraph2PerYear) =>
          xScaleGraph2(ordersGraph2PerYear._id.year) +
          xScaleGraph2.bandwidth() / 2
      )
      .attr(
        "y",
        (ordersGraph2PerYear) =>
          yScaleGraph2(ordersGraph2PerYear.ordersPriceForYear) - 15
      )
      .attr("text-anchor", "middle");
  });
});

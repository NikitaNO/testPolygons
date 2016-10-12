'use strict'

var form = d3.select('#form')
var actionButtonsContainer = d3.select('.action-btn__container')
var data = []

var svg = d3.select('#container')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500)
    .attr('id', 'demo-chart')

d3.select('#add-polygon')
    .on('click', function () {
        data.push({
            color: "#000",
            points: [{
                x: 0,
                y: 0
            }, {
                x: 100,
                y: 0
            }, {
                x: 100,
                y: 100
            }, {
                x: 0,
                y: 100
            }]
        })

        drawChart(data)
    })

d3.json('./demo.json', function (err, res) {
    if (err) return console.warn(err)

    data = res

    drawChart(res)
})

function drawChart (arr) {
    d3.selectAll('svg > *').remove()

    arr.forEach(function (el, polygonId) {
        var points = ''

        el.points.forEach(function (point) {
            points += point.x + ',' + point.y + ' '
        })

        svg.append('polygon')
            .attr('points', points)
            .attr('data-id', polygonId)
            .attr('fill', el.color)
            .on('click', function () {
                removeForm()

                form.attr('data-id', polygonId)

                var formInputsContainer = form.insert('div', '.action-btn__container')
                    .attr('class', 'form-inputs__container')

                var addPointForm = function (x, y) {
                    var container = formInputsContainer.append('div')

                    container.append('input')
                        .attr('class', 'form-control')
                        .attr('type', 'text')
                        .attr('data-id', 'x')
                        .attr('value', x)

                    container.append('input')
                        .attr('class', 'form-control')
                        .attr('type', 'text')
                        .attr('data-id', 'y')
                        .attr('value', y)

                    container.append('button')
                        .attr('class', 'btn btn-danger')
                        .text('Remove point')
                        .on('click', function () {
                            d3.select(this.parentNode).remove()
                        })

                    container.append('br')
                }

                formInputsContainer.append('span')
                    .text('Color:')

                formInputsContainer.append('input')
                    .attr('type', 'text')
                    .attr('data-id', 'color')
                    .attr('class', 'form-control')
                    .attr('value', el.color)

                formInputsContainer.append('br')

                el.points.forEach(function (point) {
                    addPointForm(point.x, point.y)
                })

                actionButtonsContainer.append('button')
                    .attr('class', 'btn btn-default')
                    .text('Add Point')
                    .on('click', function () {
                        addPointForm(0, 0)
                    })

                actionButtonsContainer.append('button')
                    .attr('class', 'btn btn-default')
                    .text('Save')
                    .on('click', function () {
                        var index = form.attr('data-id')
                        var points = ''
                        var dataPoints = []
                        var polygon = d3.select('polygon[data-id="' + index + '"]')

                        var x = document.querySelectorAll('input[data-id="x"]')
                        var y = document.querySelectorAll('input[data-id="y"]')
                        var color = document.querySelector('input[data-id="color"]')

                        for (var i = 0; i < x.length; i++) {
                            points += x[i].value + ',' + y[i].value + ' '
                            dataPoints.push({
                                x: x[i].value,
                                y: y[i].value
                            })
                        }

                        polygon.attr('points', points)
                        polygon.attr('fill', color.value)

                        data[index] = {
                            color: color.value,
                            points: dataPoints
                        }

                        removeForm()
                    })

                actionButtonsContainer.style('display', 'block')
            })
    })
}

function removeForm () {
    d3.select('.form-inputs__container').remove()
    d3.selectAll('.action-btn__container > *').remove()
}

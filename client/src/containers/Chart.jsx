import React, { Component } from 'react';
import { GradientDarkgreenGreen } from '@vx/gradient';
import { Bar } from '@vx/shape';
import { AxisBottom, AxisLeft} from '@vx/axis';
import {scaleLinear, scaleBand} from '@vx/scale';

class Chart extends Component {
  state = {
    width: 0,
    height: 0
  };

  componentDidMount() {
    window.addEventListener('resize', this.setSize);
    
    this.setSize();
  }

  setSize = (event) => {
    const { width, height } = this.chart.getBoundingClientRect();

    this.setState((prevState) => {
      return {
        width,
        height
      };
    });
  }

  setRef = (node) => {
    this.chart = node;
  }

  render() {
    const margin = 30;
    const { width, height } = this.state;
    
    const yScale = scaleLinear({
    rangeRound: [height - (margin*2), 0],
    domain: [0, 13],
    nice:true
    })

    const xScale = scaleBand({
      rangeRound: [0, width-(margin*2)],
      padding: 0.2,
      domain:["0m - 10m", "10m - 20m","20m - 30m", "30m - 40m","40m - 50m","50m - 60m","60m - 70m"],
      align: 0.5
    })
    
    /* This is a hack to first set the size based on percentage
       then query for the size so the chart can be scaled to the window size.
       The second render is caused by componentDidMount(). */
    if(width < 100 || height < 100) {
      return <svg ref={ this.setRef } width={'100%'} height={'100%'}></svg>
    }

    return (
      <svg ref={ this.setRef } width={'100%'} height={'100%'}>
        <GradientDarkgreenGreen id="gradient" />
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`url(#gradient)`}
        />{
        // <Bar
        //   width={200}
        //   height={400}
        //   x={30}
        //   y={60}
        //   stroke={'black'}
        // />
      }
        <AxisLeft
          scale={yScale}
          top={margin}
          left={margin}
          numTicks={14}
          hideAxisLine
          hideTicks
          tickLabelProps={(value, index) => ({
            fill: 'white',
            fontSize: 11,
          })}
        />
        <AxisBottom
            top={height-margin}
            left={margin}
            scale={xScale}
            hideAxisLine
            hideTicks
            tickLabelProps={(value, index) => ({
              fill: 'white',
              fontSize: 11,
              textAnchor: 'middle'
            })}
          />
      </svg>
    );
  }
}

export default Chart;

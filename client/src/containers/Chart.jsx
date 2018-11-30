import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GradientDarkgreenGreen } from '@vx/gradient';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
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
    let maxFreq = 0;
    const { width, height } = this.state;
    const data = {
      '0m - 10m': {key: '0m - 10m', freq: 0},
      '10m - 20m': {key: '10m - 20m', freq: 0},
      '20m - 30m': {key: '20m - 30m', freq: 0},
      '30m - 40m': {key: '30m - 40m', freq: 0},
      '40m - 50m': {key: '40m - 50m', freq: 0},
      '50m - 60m': {key: '50m - 60m', freq: 0},
      '60m - 70m': {key: '60m - 70m', freq: 0}
    }

    this.props.treesBySite.map(treeHeight => {
      let range = '';
      if(treeHeight <= 10 ) {
        range = '0m - 10m';
      } else if (treeHeight <= 20) {
        range = '10m - 20m';
      } else if (treeHeight <= 30) {
        range = '20m - 30m';
      } else if (treeHeight <= 40) {
        range = '30m - 40m';
      } else if (treeHeight <= 50) {
        range = '40m - 50m';
      } else if (treeHeight <= 60) {
        range = '50m - 60m';
      } else {
        range = '60m - 70m';
      }
      const freq = ++data[range].freq;
      if(freq > maxFreq) {
          maxFreq = freq;
      }
    });

    const yScale = scaleLinear({
      rangeRound: [height-(margin*2), 0],
      domain: [0, maxFreq]
    })

    const xScale = scaleBand({
      rangeRound: [0, width-(margin*2)],
      domain: Object.keys(data),
      padding: 0.4,
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
        />
        <Group left={margin} top={margin}>
          {
            Object.keys(data).map(range => {
              const barWidth = xScale.bandwidth();
              const barHeight = height - (margin*2) - yScale(data[range].freq);
              const barX = xScale(range);
              const barY = height - (margin*2)- barHeight;

              return (
                 <Bar
                  key={`bar-${range}`}
                  width={barWidth}
                  height={barHeight}
                  fill={'#00b38f'}
                  x={barX}
                  y={barY}
                />
              );
            })
          }
        </Group>
        <AxisLeft
          scale={yScale}
          top={margin}
          left={margin}
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

function mapStateToProps(state) {
  let i = 0;
  const filteredTrees = state.trees.ids.reduce((acc, curr) => {
    if(state.trees.byId[curr].site_id === state.sites.selected){
      acc[i] = state.trees.byId[curr].height;
      i++;
    }
    return acc;
  }, []);

  return {
    treesBySite: filteredTrees,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Chart);

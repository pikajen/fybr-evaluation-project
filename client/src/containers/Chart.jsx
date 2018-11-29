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
    const { width, height } = this.state;
    const data = [
      {key: '0m - 10m', freq: 0},
      {key: '10m - 20m', freq: 0},
      {key: '20m - 30m', freq: 0},
      {key: '30m - 40m', freq: 0},
      {key: '40m - 50m', freq: 0},
      {key: '50m - 60m', freq: 0},
      {key: '60m - 70m', freq: 0}
    ]

    const yScale = scaleLinear({
      rangeRound: [height-(margin*2), 0],
      domain: [0, 13],
    })

    const xScale = scaleBand({
      rangeRound: [0, width-(margin*2)],
      domain: data.map(x => x.key),
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
           this.props.treesBySite.map(tree => {
            const barWidth = xScale.bandwidth();
            const barHeight = height - (margin*2) - yScale(10);
            const barX = xScale("30m - 40m");
            const barY = height - (margin*2)- barHeight;
            // const res = data.filter(obj => {
            //   return obj.key === "30m - 40m";
            // })
            return (
               <Bar
                width={barWidth}
                height={barHeight}
                fill={'#00b38f'}
                x={barX}
                y={barY}
                />
              );
          })}
        </Group>
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

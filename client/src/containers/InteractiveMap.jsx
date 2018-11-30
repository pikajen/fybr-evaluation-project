import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as turf from '@turf/turf';

import Map, { Layer, Sources, GeoJSON } from '../components/map';

import { centerMapOnSite, mapSetCenter, mapSetZoom } from '../model/map';

class InteractiveMap extends Component {
  render() {
    const { bounding } = this.props.currentSite;

    const boundingFeature = turf.polygon([[
      [bounding.left, bounding.top],
      [bounding.right, bounding.top],
      [bounding.right, bounding.bottom],
      [bounding.left, bounding.bottom],
      [bounding.left, bounding.top]
    ]], { name: 'Bounding Area' });

    const percentColours = [
      {pct: 0.0, colour: {r: 0xff, g: 0xff, b: 0xff}},
      {pct: 0.5, colour: {r: 91, g: 215, b: 91}},
      {pct: 1.0, colour: {r: 20, g: 82, b: 20}}
    ];

    let getColourForPercentage = (pct => {
      let i;
      for(i = 1; i < percentColours.length - 1; i++) {
        if(pct < percentColours[i].pct) {
          break;
        }
      }
      const lowerColour = percentColours[i-1]; 
      const upperColour = percentColours[i];
      const rangePct = (pct - lowerColour.pct)/(upperColour.pct - lowerColour.pct);
      const pctLower = 1 - rangePct;
      const pctUpper = rangePct;
      const colour = {
        r: Math.floor(lowerColour.colour.r * pctLower + upperColour.colour.r * pctUpper),
        g: Math.floor(lowerColour.colour.g * pctLower + upperColour.colour.g * pctUpper),
        b: Math.floor(lowerColour.colour.b * pctLower + upperColour.colour.b * pctUpper)
      };
      return `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
    })

    const treeGeoJsonSources = this.props.treesBySite.map((tree, index) => {
      const treePoints = turf.point([tree.long, tree.lat]);
      return (<GeoJSON id={`tree-${tree.id}`} key={`tree-${tree.id}`} data={treePoints}/>);
    })

    const treeLayers = this.props.treesBySite.map((tree, index) => {
      const heightPer = ((tree.height)/70).toFixed(2);
      const colour = getColourForPercentage(heightPer);
      return(
          <Layer
          key={`tree-${tree.id}`}
          id={`tree-${tree.id}`}
          type="circle"
          paint={{
            'circle-radius' : 4,
            'circle-color' : colour
          }}
          source={`tree-${tree.id}`}
          />
        );
    })

    return (
      <Map { ...this.props }>
        <Sources>
          <GeoJSON id="bounding-box" data={ boundingFeature } />
          {treeGeoJsonSources}
        </Sources>
        <Layer
          id="bounding-box"
          type="line"
          paint={{
            'line-width': 2,
            'line-color': '#fff'
          }}
          source="bounding-box"
        />
        <Layer
          id="filling-box"
          type="fill"
          paint={{
            'fill-color': '#fff',
            'fill-opacity': 0.20
          }}
          source='bounding-box'
        />
        {treeLayers}
      </Map>
    );
  }
}

function mapStateToProps(state) {
  let i = 0;
  const filteredTrees = state.trees.ids.reduce((acc, curr) => {
    if(state.trees.byId[curr].site_id === state.sites.selected){
      acc[i] = state.trees.byId[curr];
      i++;
    }
    return acc;
  }, []);
  
  return {
    currentSite: state.sites.byId[state.sites.selected],
    treesBySite: filteredTrees,
    center: state.map.center,
    zoom: state.map.zoom
  };
}

const mapDispatchToProps = {
  centerMapOnSite,
  mapSetCenter,
  mapSetZoom
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveMap);

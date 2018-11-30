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

    const treeCoords = this.props.treesBySite.map( tree => {
      return [tree.long, tree.lat];
    })

    const treeFeature = turf.points(
      treeCoords
    );

    const percentColours = [
      {pct: 0.0, colour: {r: 0xff, g: 0xff, b: 0xff}},
      {pct: 0.5, colour: {r: 0x00, g: 0xff, b: 0x00}},
      {pct: 1.0, colour: {r: 0x00, g: 0x33, b: 0x00}}
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


    return (
      <Map { ...this.props }>
        <Sources>
          <GeoJSON id="bounding-box" data={ boundingFeature } />
          <GeoJSON id="tree-points" data={treeFeature} />
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
        <Layer
          id="tree-points"
          type="circle"
          paint={{
            'circle-radius' : 4,
            'circle-color' : getColourForPercentage(0.7)
          }}
          source='tree-points'
          />
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

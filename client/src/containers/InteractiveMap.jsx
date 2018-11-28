import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as turf from '@turf/turf';

import Map, { Layer, Sources, GeoJSON } from '../components/map';

import { centerMapOnSite, mapSetCenter, mapSetZoom } from '../model/map';

class InteractiveMap extends Component {
  render() {
    const { bounding } = this.props.currentSite;
    console.log(this.props.treesBySite);
    const lat = this.props.treesBySite[1976].lat;
    const long = this.props.treesBySite[1976].long;
    const boundingFeature = turf.polygon([[
      [bounding.left, bounding.top],
      [bounding.right, bounding.top],
      [bounding.right, bounding.bottom],
      [bounding.left, bounding.bottom],
      [bounding.left, bounding.top]
    ]], { name: 'Bounding Area' });

    const treeFeature = turf.point([long, lat]);

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
            'circle-radius' : 5,
            'circle-color' : 'white'
          }}
          source="tree-points"
          />
      </Map>
    );
  }
}

function mapStateToProps(state) {

  const filteredTrees = state.trees.ids.reduce((acc, curr) => {
    if(state.trees.byId[curr].site_id === state.sites.selected){
      acc[curr] = state.trees.byId[curr];
    }
    return acc;
  }, {});
  
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

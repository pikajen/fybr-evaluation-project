import React, { Component } from 'react';
import MenuItem from './MenuItem'
import styles from './List.scss';

export default function List(props) {
	const {items, sites, onClickSubitem} = props;
  return (
    <div>
    	{items[0].map(item => <MenuItem item={item} key={item.id} sites={sites} onClickSubitem={onClickSubitem}/>)}
    </div>
  );
}

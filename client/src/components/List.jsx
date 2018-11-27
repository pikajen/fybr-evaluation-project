import React, { Component } from 'react';
import MenuItem from './MenuItem'
import styles from './List.scss';

export default function List(props) {
	let projectArray = props.items[0].map(item => {
		return <dt key={item.id} className={ styles.parentItem }>{item.name}</dt>
	})
  return (
    <div>
    	{props.items[0].map(item => <MenuItem item={item} key={item.id}/>
    	)}

    </div>
  );
}

import React, { Component } from 'react';

import styles from './List.scss';

export default function List(props) {
	let projectArray = props.items[0].map(item => {
		return <li key={item.id} className={ styles.parentItem }>{item.name}</li>
	})
  return (
    <div>
    	{projectArray}
    </div>
  );
}

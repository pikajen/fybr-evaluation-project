import React, { Component } from 'react';

import styles from './List.scss';

export default class MenuItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	toggle = () => {
		this.setState({open: !this.state.open});
	}

	render() {
		const item = this.props.item;
		return (
			<div>
			<dt key={item.id} onClick={this.toggle} className={ styles.parentItem }>{item.name}</dt>
			{this.state.open &&
				<div>
				<dd className={styles.subItem}> sites </dd> 
				</div>
			}
			</div>
		);
	}
}
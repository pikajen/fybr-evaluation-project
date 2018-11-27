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
		const {item, sites, onClickSubitem} = this.props;
		let siteArray = item.sites.map(site => {
			let siteName = (sites.find(obj => obj.id == site)).name;
			return <dd key={site} className={styles.subItem} onClick={() => onClickSubitem(site)}> {siteName} </dd> 
		})
		return (
			<div>
			<dt key={item.id} onClick={this.toggle} className={ styles.parentItem }>{item.name}</dt>
			{this.state.open &&
				<div>
					{siteArray}
				</div>
			}
			</div>
		);
	}
}
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from '../config/ItemTypes';
import ItemCss from '../config/ItemCss';

const templateItemSource = {
	beginDrag(props) {
		props.updateDragging(props.newId);
		return {
			id: props.newId,
			index: props.index,
			templateItemType: props.templateItemType
		};
	},
	endDrag(props) {
		props.updateDragging(null);
	}
}

class TemplateItem extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
    updateDragging: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		newId: PropTypes.number.isRequired,
		type: PropTypes.string.isRequired,
		value: PropTypes.string.isRequired,
		color: PropTypes.string,
		templateItemType: PropTypes.string.isRequired
	}

	render() {
		const {
			type,
			value,
			color,
			connectDragSource,
		} = this.props

		const style = {
			display: 'flex',
			alignItems: 'center',
			border: '1px solid black',
			borderRadius: '10px',
			padding: '5px 12px',
			margin: '3px'
		}

		style.backgroundColor = ItemCss[type]
		if (color) style.backgroundColor = color

		return connectDragSource(
			<div style={{ ...style }}>{value}</div>
		);
	}
}

export default DragSource(ItemTypes.TEMPLATE_ITEM, templateItemSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource()
}))(TemplateItem);

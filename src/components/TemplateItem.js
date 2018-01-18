import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
		templateItemType: PropTypes.string.isRequired,
		renderIcon: PropTypes.func.isRequired
	}

	render() {
		const {
			connectDragSource,
			type,
			value,
			color,
			renderIcon
		} = this.props

		const style = _.clone(ItemCss.templateItemStyle)

		style.backgroundColor = ItemCss.backgroundColor[type]
		if (color) style.backgroundColor = color

		return connectDragSource(
			<div style={{ ...style }}>{renderIcon(value)}</div>
		);
	}
}

export default DragSource(ItemTypes.TEMPLATE_ITEM, templateItemSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource()
}))(TemplateItem);

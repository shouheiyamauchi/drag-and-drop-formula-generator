import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import flow from 'lodash/flow';

const style = {
	border: '1px solid black',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
}

const cardSource = {
	beginDrag(props) {
		return {
			id: props.newId,
			index: props.index,
		}
	},
}

class TemplateItem extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired,
	}

	render() {
		const {
			id,
			text,
			isDragging,
			connectDragSource,
		} = this.props

		return connectDragSource(
			<div style={{ ...style }}>{text}</div>
		)
	}
}

export default DragSource(ItemTypes.TEMPLATE_ITEM, cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
}))(TemplateItem)

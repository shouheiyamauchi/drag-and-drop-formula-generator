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

const templateItem = {
	beginDrag(props) {
		return {
			id: props.newId,
			index: props.index
		}
	},
}

class TemplateItem extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		value: PropTypes.string.isRequired,
	}

	render() {
		const {
			id,
			value,
			connectDragSource,
		} = this.props

		return connectDragSource(
			<div style={{ ...style }}>{value}</div>
		)
	}
}

export default DragSource(ItemTypes.TEMPLATE_ITEM, templateItem, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
}))(TemplateItem)

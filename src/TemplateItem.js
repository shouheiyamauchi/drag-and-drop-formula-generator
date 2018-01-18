import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes'

const templateItemSource = {
	beginDrag(props) {
		props.updateDragging(props.newId)
		return {
			id: props.newId,
			index: props.index
		}
	},
	endDrag(props) {
		props.updateDragging(null)
	}
}

class TemplateItem extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
    updateDragging: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		newId: PropTypes.number.isRequired,
		value: PropTypes.string.isRequired,
	}

	render() {
		const {
			value,
			connectDragSource,
		} = this.props

		const style = {
			border: '1px solid black',
			padding: '0.5rem 1rem',
			marginBottom: '.5rem',
			backgroundColor: 'white'
		}

		return connectDragSource(
			<div style={{ ...style }}>{value}</div>
		)
	}
}

export default DragSource(ItemTypes.TEMPLATE_ITEM, templateItemSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource()
}))(TemplateItem)

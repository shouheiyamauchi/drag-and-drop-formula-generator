import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import flow from 'lodash/flow';
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import Bracket from './Bracket'

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
}

const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const cardTarget = {
	hover(props, monitor, component) {
		if (monitor.isOver({ shallow: true })) console.log(props)
		if (monitor.isOver({ shallow: true })) console.log(new Date().getTime())
		return

		const dragItem = monitor.getItem()
		const dragIndex = monitor.getItem().index
		const dragId = monitor.getItem().id

		const hoverIndex = props.index
		const hoverId = props.id

		// don't replace items with themselves
		if (dragId === hoverId) {
			return
		}

		// determine whether item is on left or right side
		const hoverElementProperties = document.getElementById(props.id).getBoundingClientRect()
		const centerOfElement = (hoverElementProperties.x + hoverElementProperties.width / 2)
		const mouseHorizontalPosition = monitor.getClientOffset().x

		let leftOrRight = ''

		if (mouseHorizontalPosition < centerOfElement) {
			leftOrRight = 'left'
		} else if (mouseHorizontalPosition > centerOfElement) {
			leftOrRight = "right"
		}

		switch(monitor.getItemType()) {
			case 'card':
				props.moveCard(dragIndex, hoverIndex, leftOrRight)
				monitor.getItem().index = hoverIndex
				break;
			case 'templateItem': // drag in items from the templates
				props.addAndDragItem(dragItem, hoverIndex, leftOrRight)
				break;
		}

	},
}

class Card extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		id: PropTypes.any.isRequired,
		text: PropTypes.any.isRequired,
		moveCard: PropTypes.func.isRequired,
	}

	renderObject = props => {
		const style = {
			border: '1px dashed gray',
			padding: '0.5rem 1rem',
			marginBottom: '.5rem',
			backgroundColor: 'white',
			cursor: 'move',
		}

		const {
			id,
			text,
			type,
			isDragging,
			moveCard,
			addAndDragItem,
		} = props
		const opacity = isDragging ? 0.5 : 1

		if (type === 'primary') {
			return <div style={{ ...style, opacity }} id={id}>{text}</div>
		} else if (type === 'bracket') {
			return (
				<div>
					<Bracket id={id} cards={text} moveCard={moveCard} addAndDragItem={addAndDragItem} />
				</div>

			)
		}
	}

	render() {
		const {
			connectDragSource,
			connectDropTarget,
		} = this.props

		return connectDragSource(
			connectDropTarget(this.renderObject(this.props)),
		)
	}
}

export default flow(
  DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  	connectDragSource: connect.dragSource(),
  	isDragging: monitor.isDragging(),
  })),
  DropTarget([ItemTypes.BRACKET, ItemTypes.TEMPLATE_ITEM, ItemTypes.CARD], cardTarget, connect => ({
  	connectDropTarget: connect.dropTarget(),
  }))
)(Card)

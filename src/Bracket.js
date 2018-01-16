import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import Card from './Card'
import flow from 'lodash/flow';

const style = {
  display: 'flex',
  flexDirection: 'row',
}

const bracketStyle = {
	padding: '0.5rem 1rem'
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

		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		const dragId = monitor.getItem().id
		const hoverId = props.id

		const dragItem = monitor.getItem()

		// Don't replace items with themselves
		if (dragId === hoverId) {
			return
		}

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
				// Time to actually perform the action
				props.moveCard(dragIndex, hoverIndex, leftOrRight)

				// Note: we're mutating the monitor item here!
				// Generally it's better to avoid mutations,
				// but it's good here for the sake of performance
				// to avoid expensive index searches.
				monitor.getItem().index = hoverIndex
				break;
			case 'templateItem':
				props.addAndDragItem(dragItem, hoverIndex, leftOrRight)
				break;
		}

	},
}

class Bracket extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired,
		cards: PropTypes.array.isRequired,
	}

	render() {
		const {
			id,
			isDragging,
			connectDragSource,
			connectDropTarget,
			cards,
			moveCard,
			addAndDragItem,
		} = this.props
		const opacity = isDragging ? 0 : 1

		return connectDragSource(
			connectDropTarget(<div style={style}>
				<span style={bracketStyle}>(</span>
				{cards.map((card, i) => (
					<Card
						key={card.id}
						index={i}
						id={card.id}
						text={card.text}
						type={card.type}
						moveCard={moveCard}
						addAndDragItem={addAndDragItem}
					/>
				))}
			<span style={bracketStyle}>)</span>
			</div>),
		)
	}
}

export default flow(
  DragSource(ItemTypes.BRACKET, cardSource, (connect, monitor) => ({
  	connectDragSource: connect.dragSource(),
  	isDragging: monitor.isDragging(),
  })),
  DropTarget([ItemTypes.BRACKET, ItemTypes.TEMPLATE_ITEM, ItemTypes.CARD], cardTarget, connect => ({
  	connectDropTarget: connect.dropTarget(),
  }))
)(Bracket)

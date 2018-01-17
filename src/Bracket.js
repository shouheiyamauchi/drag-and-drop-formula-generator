import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import LogicElement from './LogicElement'
import flow from 'lodash/flow';

const style = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  border: '1px dashed gray',
  padding: '3px',
}

const bracketStyle = {
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
		// if (monitor.isOver({ shallow: true })) console.log(props)
		// if (monitor.isOver({ shallow: true })) console.log(new Date().getTime())
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

		const hoverElementProperties = document.getElementById('logic-element' + props.id).getBoundingClientRect()
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
				props.moveLogicElement(dragIndex, hoverIndex, leftOrRight)

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
		singleElements: PropTypes.array.isRequired,
	}

	render() {
		const {
			id,
			connectDragSource,
			connectDropTarget,
      draggingId,
			singleElements,
			moveLogicElement,
			addAndDragItem,
		} = this.props

		return connectDragSource(
			connectDropTarget(<div style={style} id={'logic-element' + id}>
				<span style={bracketStyle}>(</span>
				{singleElements.map((card, i) => (
					<LogicElement
						key={card.id}
						id={card.id}
						value={card.value}
						type={card.type}
            draggingId={draggingId}
						moveLogicElement={moveLogicElement}
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
  DropTarget([ItemTypes.BRACKET, ItemTypes.TEMPLATE_ITEM, ItemTypes.SINGLE_ELEMENT], cardTarget, connect => ({
  	connectDropTarget: connect.dropTarget(),
  }))
)(Bracket)

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

const bracketSource = {
	beginDrag(props) {
		return {
			id: props.id
		}
	},
}

const bracketTarget = {
  hover(props, monitor, component) {
		if (!monitor.isOver({ shallow: true })) return

		const dragItem = monitor.getItem()
		const dragId = monitor.getItem().id

		const hoverItem = props
		const hoverId = props.id

		// don't replace items with themselves
		if (dragId === hoverId) {
			return
		}

		// determine whether item is on left or right side
		const hoverElementProperties = document.getElementById('rule-builder-id-' + props.id).getBoundingClientRect()
		const centerOfElement = (hoverElementProperties.x + hoverElementProperties.width / 2)
		const mouseHorizontalPosition = monitor.getClientOffset().x

		let leftOrRight = ''

		if (mouseHorizontalPosition < centerOfElement) {
			leftOrRight = 'left'
		} else if (mouseHorizontalPosition > centerOfElement) {
			leftOrRight = "right"
		}

		switch(monitor.getItemType()) {
			case 'logicElement':
			case 'bracket':
				props.moveLogicElement(dragId, hoverId, leftOrRight)
				break;
			case 'templateItem': // drag in items from the templates
				props.addAndDragItem(dragItem, hoverId, leftOrRight)
				break;
		}

	}

	// hover(props, monitor, component) {
	// 	if (!monitor.isOver({ shallow: true })) return
  //
	// 	// const dragItem = monitor.getItem()
	// 	// const dragId = monitor.getItem().id
  //   //
	// 	// const hoverItem = props
	// 	// const hoverId = props.id
  //
	// 	// don't replace items with themselves
	// 	// if (dragId === hoverId) {
	// 	// 	return
	// 	// }
  //
	// 	// determine whether item is on left or right side
	// 	// const hoverElementProperties = document.getElementById('rule-builder-id-' + props.id).getBoundingClientRect()
	// 	// const centerOfElement = (hoverElementProperties.x + hoverElementProperties.width / 2)
	// 	// const mouseHorizontalPosition = monitor.getClientOffset().x
  //   //
	// 	// let leftOrRight = ''
  //   //
	// 	// if (mouseHorizontalPosition < centerOfElement) {
	// 	// 	leftOrRight = 'left'
	// 	// } else if (mouseHorizontalPosition > centerOfElement) {
	// 	// 	leftOrRight = "right"
	// 	// }
  //
	// 	// switch(monitor.getItemType()) {
	// 	// 	case 'logicElement':
	// 	// 	case 'bracket':
	// 	// 		props.moveLogicElement(dragId, hoverId, leftOrRight)
	// 	// 		break;
	// 	// 	case 'templateItem': // drag in items from the templates
	// 	// 		// props.addAndDragItem(dragItem, hoverIndex, leftOrRight)
	// 	// 		break;
	// 	// }
  //
	// },
}

class Bracket extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired,
		logicElements: PropTypes.array.isRequired,
	}

	render() {
		const {
			id,
			connectDragSource,
			connectDropTarget,
      draggingId,
      updateDragging,
			logicElements,
			moveLogicElement,
      moveBracket,
			addAndDragItem,
		} = this.props

		return connectDragSource(
			connectDropTarget(<div style={style} id={'rule-builder-id-' + id}>
				<span style={bracketStyle}>(</span>
				{logicElements.map((card, i) => (
					<LogicElement
						key={card.id}
						id={card.id}
						value={card.value}
						type={card.type}
            draggingId={draggingId}
            updateDragging={updateDragging}
						moveLogicElement={moveLogicElement}
            moveBracket={moveBracket}
						addAndDragItem={addAndDragItem}
					/>
				))}
			<span style={bracketStyle}>)</span>
			</div>),
		)
	}
}

export default flow(
  DragSource(ItemTypes.BRACKET, bracketSource, (connect, monitor) => ({
  	connectDragSource: connect.dragSource(),
  	isDragging: monitor.isDragging(),
  })),
  DropTarget([ItemTypes.BRACKET, ItemTypes.TEMPLATE_ITEM, ItemTypes.LOGIC_ELEMENT], bracketTarget, connect => ({
  	connectDropTarget: connect.dropTarget(),
  }))
)(Bracket)

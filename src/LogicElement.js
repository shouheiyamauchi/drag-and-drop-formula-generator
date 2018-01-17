import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import flow from 'lodash/flow';
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import Bracket from './Bracket'

const logicElementSource = {
	beginDrag(props) {
		props.updateDragging(props.id)
		return {
			id: props.id
		}
	},
	endDrag(props) {
		props.updateDragging(null)
	}
}

const logicElementTarget = {
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
		const hoverElementProperties = document.getElementById('rule-builder-id-' + hoverId).getBoundingClientRect()
		const centerOfElement = (hoverElementProperties.x + hoverElementProperties.width / 2)
		const mouseHorizontalPosition = monitor.getClientOffset().x

		let leftOrRight = ''

		if (mouseHorizontalPosition < centerOfElement) {
			leftOrRight = 'left'
		} else if (mouseHorizontalPosition > centerOfElement) {
			leftOrRight = "right"
		}

		props.moveElement(props, monitor, ItemTypes.LOGIC_ELEMENT)

		// switch(monitor.getItemType()) {
		// 	case 'logicElement':
		// 	case 'bracket':
		// 		props.moveLogicElement(props, monitor, ItemTypes.LOGIC_ELEMENT)
		// 		break;
		// 	case 'templateItem': // drag in items from the templates
		// 		props.addAndDragItem(props, monitor, ItemTypes.LOGIC_ELEMENT)
		// 		break;
		// }

	},
}

class LogicElement extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired,
		id: PropTypes.any.isRequired,
		value: PropTypes.any.isRequired,
		moveLogicElement: PropTypes.func.isRequired,
	}

	renderObject = props => {
		const style = {
			display: 'flex',
			alignItems: 'center',
			border: '1px solid gray',
			padding: '0.5rem 1rem',
			backgroundColor: 'white',
		}

		const {
			id,
			value,
			type,
			draggingId,
			moveElement,
			updateDragging,
			moveLogicElement,
			addAndDragItem,
		} = props
		const opacity = id === draggingId ? 0.5 : 1

		if (type === 'number' || type === 'operator') {
			return <div style={{ ...style, opacity }} id={'rule-builder-id-' + id}>{value}</div>
		} else if (type === 'bracket') {
			return (
				<div>
					<Bracket id={id} logicElements={value} draggingId={draggingId} updateDragging={updateDragging} moveElement={moveElement} moveLogicElement={moveLogicElement} addAndDragItem={addAndDragItem} />
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
  DragSource(ItemTypes.LOGIC_ELEMENT, logicElementSource, (connect, monitor) => ({
  	connectDragSource: connect.dragSource(),
  	isDragging: monitor.isDragging(),
  })),
  DropTarget([ItemTypes.BRACKET, ItemTypes.TEMPLATE_ITEM, ItemTypes.LOGIC_ELEMENT], logicElementTarget, connect => ({
  	connectDropTarget: connect.dropTarget(),
  }))
)(LogicElement)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    // prevent executing on parent containers
		if (!monitor.isOver({ shallow: true })) return

    props.moveElement(props, monitor, ItemTypes.BRACKET)
	}
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
      moveElement,
      updateDragging,
			logicElements
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
            moveElement={moveElement}
            updateDragging={updateDragging}
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

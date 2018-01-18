import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import LogicElement from './LogicElement'
import flow from 'lodash/flow';

const bracketSource = {
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
    draggingId: PropTypes.number,
    updateDragging: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    logicElements: PropTypes.array.isRequired,
    moveElement: PropTypes.func.isRequired
	}

	render() {
		const {
			connectDragSource,
			connectDropTarget,
      draggingId,
      updateDragging,
  		id,
			logicElements,
      moveElement
		} = this.props

    const opacity = id === draggingId ? 0.5 : 1

    const style = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      border: '1px dashed gray',
      padding: '5px',
      margin: '3px'
    }

    const bracketStyle = {
    }

		return connectDragSource(
			connectDropTarget(<div style={{ ...style, opacity }} id={'rule-builder-id-' + id}>
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
  	connectDragSource: connect.dragSource()
  })),
  DropTarget([ItemTypes.BRACKET, ItemTypes.TEMPLATE_ITEM, ItemTypes.LOGIC_ELEMENT], bracketTarget, connect => ({
  	connectDropTarget: connect.dropTarget()
  }))
)(Bracket)

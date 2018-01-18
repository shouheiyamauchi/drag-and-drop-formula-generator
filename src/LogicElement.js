import React, { Component } from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import Bracket from './Bracket';
import NumberElement from './NumberElement';

const logicElementSource = {
	beginDrag(props) {
		props.updateDragging(props.id);
		return {
			id: props.id
		};
	},
	endDrag(props) {
		props.updateDragging(null);
	}
}

const logicElementTarget = {
	hover(props, monitor, component) {
    // prevent executing on parent containers
		if (!monitor.isOver({ shallow: true })) return;

		props.moveElement(props, monitor, ItemTypes.LOGIC_ELEMENT);
	},
}

class LogicElement extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		draggingId: PropTypes.number,
    updateDragging: PropTypes.func.isRequired,
		id: PropTypes.number.isRequired,
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.array
		]).isRequired,
		type: PropTypes.string.isRequired,
		moveElement: PropTypes.func.isRequired,
		editingId: PropTypes.number,
		changeNumber: PropTypes.func.isRequired
	}

	renderObject = props => {
		const style = {
			display: 'flex',
			alignItems: 'center',
			border: '1px solid black',
			borderRadius: '10px',
			padding: '5px 12px',
			margin: '3px'
		}

		const {
			draggingId,
			updateDragging,
			id,
			value,
			type,
			moveElement,
			editingId,
			changeNumber
		} = props

		const opacity = id === draggingId ? 0.5 : 1

		if (type === 'operator') {
			style.backgroundColor = 'aqua'
			return (
				<div style={{ opacity }} id={'rule-builder-id-' + id}>
					<div style={style}>
						{value}
					</div>
				</div>
			);
		} else if (type === 'comparison') {
			style.backgroundColor = 'pink'
			return (
				<div style={{ opacity }} id={'rule-builder-id-' + id}>
					<div style={style}>
						{value}
					</div>
				</div>
			);
		} else if (type === 'number') {
			return (
				<div style={{ opacity }} id={'rule-builder-id-' + id}>
					<div style={style}>
						<NumberElement id={id} value={value} editingId={editingId} changeNumber={changeNumber} />
					</div>
				</div>
			);
		} else if (type === 'bracket') {
			return (
				<div>
					<Bracket
						id={id}
						logicElements={value}
						moveElement={moveElement}
						draggingId={draggingId}
						updateDragging={updateDragging}
						editingId={editingId}
						changeNumber={changeNumber}
					/>
				</div>
			);
		};
	}

	render() {
		const {
			connectDragSource,
			connectDropTarget
		} = this.props

		return connectDragSource(
			connectDropTarget(
				this.renderObject(this.props)
			)
		);
	}
}

export default flow(
  DragSource(ItemTypes.LOGIC_ELEMENT, logicElementSource, (connect, monitor) => ({
  	connectDragSource: connect.dragSource()
  })),
  DropTarget([ItemTypes.BRACKET, ItemTypes.TEMPLATE_ITEM, ItemTypes.LOGIC_ELEMENT], logicElementTarget, connect => ({
  	connectDropTarget: connect.dropTarget()
  }))
)(LogicElement);

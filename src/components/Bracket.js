import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import ItemTypes from '../config/ItemTypes';
import LogicElement from './LogicElement';

const bracketSource = {
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

const bracketTarget = {
  hover(props, monitor, component) {
    // prevent executing on parent containers
		if (!monitor.isOver({ shallow: true })) return;

    props.moveElement(props, monitor, ItemTypes.BRACKET);
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
    moveElement: PropTypes.func.isRequired,
		editingId: PropTypes.number,
		changeNumber: PropTypes.func.isRequired
	}

	render() {
		const {
			connectDragSource,
			connectDropTarget,
      draggingId,
      updateDragging,
  		id,
			logicElements,
      moveElement,
      editingId,
      changeNumber
		} = this.props

    const opacity = id === draggingId ? 0.5 : 1

    const style = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      border: '1px dashed transparent',
      borderRadius: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      padding: '2px 5px',
      margin: '3px 0px'
    }

    const bracketStyle = {
      fontSize: '20px',
      padding: '0px 3px'
    }

		return (
      <div style={{margin: '3px'}}>
        {connectDragSource(
    			connectDropTarget(
            <div style={{ ...style, opacity }} id={'rule-builder-id-' + id}>
              <span style={bracketStyle}>(</span>
                {logicElements.map((card, i) => (
                  <LogicElement
                    key={card.id}
                    id={card.id}
                    value={card.value}
                    type={card.type}
										color={card.color}
                    draggingId={draggingId}
                    moveElement={moveElement}
                    updateDragging={updateDragging}
                    editingId={editingId}
                    changeNumber={changeNumber}
                  />
                ))}
              <span style={bracketStyle}>)</span>
            </div>
          ),
    		)}
      </div>
    );
	}
}

export default flow(
  DragSource(ItemTypes.BRACKET, bracketSource, (connect, monitor) => ({
  	connectDragSource: connect.dragSource()
  })),
  DropTarget([ItemTypes.BRACKET, ItemTypes.TEMPLATE_ITEM, ItemTypes.LOGIC_ELEMENT], bracketTarget, connect => ({
  	connectDropTarget: connect.dropTarget()
  }))
)(Bracket);
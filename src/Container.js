import React, { Component } from 'react';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TemplateItem from './TemplateItem'
import LogicElement from './LogicElement'

const style = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
}

class Container extends Component {
  constructor(props) {
    super(props);
    this.updateDragging = this.updateDragging.bind(this);
    this.addAndDragItem = this.addAndDragItem.bind(this);
    this.moveLogicElement = this.moveLogicElement.bind(this);
    this.getParentArrayAndIndex = this.getParentArrayAndIndex.bind(this);
    this.getSingleElement = this.getSingleElement.bind(this);
    this.hoverIsChildOfDrag = this.hoverIsChildOfDrag.bind(this);

    this.state = {
      draggingId: null,
      newId: 16,
      templateItems: [
        {
          value: '+'
        },
        {
          value: '-'
        },
        {
          value: '/'
        },
        {
          value: '*'
        }
      ],
      singleElements: [
				{
					id: 1,
          type: 'number',
					value: '1'
				},
				{
					id: 2,
          type: 'number',
					value: '2'
				},
				{
					id: 3,
          type: 'bracket',
					value: [
            {
    					id: 8,
              type: 'number',
    					value: '8'
    				},
    				{
    					id: 9,
              type: 'number',
    					value: '9'
    				},
            {
    					id: 10,
              type: 'bracket',
    					value: [
                {
        					id: 11,
                  type: 'number',
        					value: '11'
        				},
        				{
        					id: 12,
                  type: 'number',
        					value: '12'
        				},
              ],
    				},
          ]
				},
				{
					id: 4,
          type: 'number',
					value: '4'
				},
				{
					id: 5,
          type: 'number',
					value: '5'
				},
				{
					id: 6,
          type: 'number',
					value: '6'
				},
        {
					id: 13,
          type: 'bracket',
					value: [
            {
    					id: 14,
              type: 'number',
    					value: '14'
    				},
    				{
    					id: 15,
              type: 'number',
    					value: '15'
    				}
          ]
        },
				{
					id: 7,
          type: 'number',
					value: '7'
				},
			]
    }
  }

  updateDragging(id) {
    this.setState({draggingId: id});
  }

  moveLogicElement(dragId, hoverId, leftOrRight) {
    const { singleElements } = this.state;

    // cancel if a dragging element is hovering over its own child
    if (this.getSingleElement(dragId).type === 'bracket' && this.hoverIsChildOfDrag(dragId, hoverId, singleElements)) return

    const parentAndIndexOfDragging = this.getParentArrayAndIndex(dragId, singleElements)
    // clone the parent array to prevent mutating original object
    const draggingObject = JSON.parse(JSON.stringify(parentAndIndexOfDragging.parentArray[parentAndIndexOfDragging.index]))

    parentAndIndexOfDragging.parentArray.splice(parentAndIndexOfDragging.index, 1)

    const parentAndIndexOfHovering = this.getParentArrayAndIndex(hoverId, singleElements)
    const hoveringObject = parentAndIndexOfHovering.parentArray[parentAndIndexOfHovering.index]

    const insertIndex = leftOrRight === 'left' ? parentAndIndexOfHovering.index : parentAndIndexOfHovering.index + 1
    parentAndIndexOfHovering.parentArray.splice(insertIndex, 0, draggingObject)

    this.setState({singleElements})
  }

  getParentArrayAndIndex(singleElementId, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === singleElementId) {
        return {parentArray: array, index: i}
      }
      if (array[i].value.constructor === Array) {
        const nestedArray = this.getParentArrayAndIndex(singleElementId, array[i].value)
        if (nestedArray) {
          return nestedArray
        }
      }
    }
  }

  getSingleElement(singleElementId) {
    const singleElementProperties = this.getParentArrayAndIndex(singleElementId, this.state.singleElements);

    return singleElementProperties.parentArray[singleElementProperties.index]
  }

  hoverIsChildOfDrag(dragId, hoverId, array) {
    const dragArray = this.getSingleElement(dragId).value

    return this.getParentArrayAndIndex(hoverId, dragArray) !== undefined
  }

  addAndDragItem(dragItem, hoverIndex, leftOrRight) {
    const { newId, singleElements, templateItems } = this.state;

    if (dragItem.id < newId) {
      this.moveLogicElement(singleElements.findIndex(card => card.id === dragItem.id), hoverIndex, leftOrRight)
      return
    }

    if (leftOrRight) {
      const insertIndex = leftOrRight === 'left' ? hoverIndex : hoverIndex + 1

      const newObject = {
        id: newId,
        value: templateItems[dragItem.index].value,
      }

      this.setState(
        update(this.state, {
          singleElements: {
            $splice: [[insertIndex, 0, newObject]]
          },
          newId: {
            $set: newId + 1
          }
        })
      )
    }
  }

  render() {
    const { templateItems, singleElements, newId } = this.state

    return (
      <div>
        <div style={style}>
          {templateItems.map((templateItem, i) => (
            <TemplateItem
              key={i}
              value={templateItem.value}
              newId={newId}
            />
          ))}
        </div>
        <div style={style}>
          {singleElements.map((card, i) => (
            <LogicElement
              key={card.id}
              id={card.id}
              type={card.type}
              value={card.value}
              draggingId={this.state.draggingId}
              updateDragging={this.updateDragging}
              moveLogicElement={this.moveLogicElement}
              moveBracket={this.moveBracket}
              addAndDragItem={this.addAndDragItem}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container);

import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import ItemTypes from './ItemTypes'
import HTML5Backend from 'react-dnd-html5-backend';
// import { default as TouchBackend } from 'react-dnd-touch-backend';
import TemplateItem from './TemplateItem'
import LogicElement from './LogicElement'
import $ from "jquery";

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draggingId: null,
      newId: 16,
      lastDrag: {
        dragId: '',
        hoverId: '',
        leftOrRightOverHoverItem: ''
      },
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
      logicElements: [
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

  updateDragging = id => {
    this.setState({draggingId: id});
  }

  mousePositionOverHoverItem = (hoverId, monitor) => {
    const hoverElementProperties = $('#rule-builder-id-' + hoverId)[0].getBoundingClientRect()
    const centerOfElement = (hoverElementProperties.left + hoverElementProperties.width / 2)
    const mouseHorizontalPosition = monitor.getClientOffset().x

    if (mouseHorizontalPosition < centerOfElement) {
      return 'left'
    } else if (mouseHorizontalPosition > centerOfElement) {
      return "right"
    }
  }

  moveElement = (props, monitor, dropTargetType) => {
    const dragItem = monitor.getItem()
    const dragId = dragItem.id

    const hoverItem = props
    const hoverId = hoverItem.id

    // don't replace items with themselves
    if (dragId === hoverId) {
      return
    }

    const leftOrRightOverHoverItem = this.mousePositionOverHoverItem(hoverId, monitor)

    // console.log(leftOrRightOverHoverItem)
    // console.log(hoverId)

    // prevent function from executing if same as last drag
    if (this.state.lastDrag.dragId === dragId && this.state.lastDrag.hoverId === hoverId && this.state.lastDrag.leftOrRightOverHoverItem === leftOrRightOverHoverItem) return

    const draggingItemType = monitor.getItemType()

    const functionList = {
      logicElement: this.moveLogicElement,
      bracket: this.moveLogicElement,
      templateItem: this.addAndDragItem
    }

    functionList[draggingItemType](hoverItem, dragItem, dropTargetType, leftOrRightOverHoverItem)
  }

  moveLogicElement = (hoverItem, dragItem, dropTargetType, leftOrRightOverHoverItem) => {
    const { logicElements } = this.state;
    const hoverId = hoverItem.id
    const dragId = dragItem.id

    // cancel if a dragging element is hovering over its own child
    if (this.getSingleElement(dragId).type === 'bracket' && this.hoverIsChildOfDrag(dragId, hoverId, logicElements)) return

    console.log("moveLogicElement")

    const parentAndIndexOfDragging = this.getParentArrayAndIndex(dragId, logicElements)
    // clone the parent array to prevent mutating original object
    const draggingObject = JSON.parse(JSON.stringify(parentAndIndexOfDragging.parentArray[parentAndIndexOfDragging.index]))

    parentAndIndexOfDragging.parentArray.splice(parentAndIndexOfDragging.index, 1)

    const parentAndIndexOfHovering = this.getParentArrayAndIndex(hoverId, logicElements)
    const hoveringObject = parentAndIndexOfHovering.parentArray[parentAndIndexOfHovering.index]

    let insertIndex = null

    if (dropTargetType === ItemTypes.LOGIC_ELEMENT) {
      insertIndex = leftOrRightOverHoverItem === 'left' ? parentAndIndexOfHovering.index : parentAndIndexOfHovering.index + 1
      parentAndIndexOfHovering.parentArray.splice(insertIndex, 0, draggingObject)
    } else if (dropTargetType === ItemTypes.BRACKET) {
      insertIndex = leftOrRightOverHoverItem === 'left' ? 0 : hoveringObject.value.length
      hoveringObject.value.splice(insertIndex, 0, draggingObject)
    }

    const lastDrag = {
      dragId,
      hoverId,
      leftOrRightOverHoverItem
    }

    this.setState({
      logicElements,
      lastDrag
    })
  }

  addAndDragItem = (hoverItem, dragItem, dropTargetType, leftOrRightOverHoverItem) => {
    const { newId, logicElements, templateItems } = this.state;
    const hoverId = hoverItem.id
    const dragId = dragItem.id
    const dragIndex = dragItem.index

    console.log("addAndDragItem")

    // redirect to move function if item has already been added to array
    if (dragId < newId) {
      this.moveLogicElement(hoverItem, dragItem, dropTargetType, leftOrRightOverHoverItem)
      return
    }

    const newObject = {
      id: newId,
      type: 'operator',
      value: templateItems[dragIndex].value
    }

    const parentAndIndexOfHovering = this.getParentArrayAndIndex(hoverId, logicElements)
    const hoveringObject = parentAndIndexOfHovering.parentArray[parentAndIndexOfHovering.index]

    let insertIndex = null

    if (dropTargetType === ItemTypes.LOGIC_ELEMENT) {
      insertIndex = leftOrRightOverHoverItem === 'left' ? parentAndIndexOfHovering.index : parentAndIndexOfHovering.index + 1
      parentAndIndexOfHovering.parentArray.splice(insertIndex, 0, newObject)
    } else if (dropTargetType === ItemTypes.BRACKET) {
      insertIndex = leftOrRightOverHoverItem === 'left' ? 0 : hoveringObject.value.length
      hoveringObject.value.splice(insertIndex, 0, newObject)
    }

    const lastDrag = {
      dragId,
      hoverId,
      leftOrRightOverHoverItem
    }

    this.setState({
      logicElements,
      lastDrag,
      newId: this.state.newId + 1
    })
  }

  getParentArrayAndIndex = (logicElementId, array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === logicElementId) {
        return {parentArray: array, index: i}
      }
      if (array[i].value.constructor === Array) {
        const nestedArray = this.getParentArrayAndIndex(logicElementId, array[i].value)
        if (nestedArray) {
          return nestedArray
        }
      }
    }
  }

  getSingleElement = (logicElementId) => {
    const logicElementProperties = this.getParentArrayAndIndex(logicElementId, this.state.logicElements);

    return logicElementProperties.parentArray[logicElementProperties.index]
  }

  hoverIsChildOfDrag = (dragId, hoverId, array) => {
    const dragArray = this.getSingleElement(dragId).value

    return this.getParentArrayAndIndex(hoverId, dragArray) !== undefined
  }

  render() {
    const {
      templateItems,
      logicElements,
      newId
    } = this.state

    const style = {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center'
    }

    return (
      <div>
        <div style={style}>
          {templateItems.map((templateItem, i) => (
            <TemplateItem
              index={i}
              key={i}
              newId={newId}
              value={templateItem.value}
              updateDragging={this.updateDragging}
            />
          ))}
        </div>
        <div style={style}>
          {logicElements.map((card, i) => (
            <LogicElement
              key={card.id}
              id={card.id}
              type={card.type}
              value={card.value}
              moveElement={this.moveElement}
              draggingId={this.state.draggingId}
              updateDragging={this.updateDragging}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container);
// export default DragDropContext(TouchBackend)(Container);

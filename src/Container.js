import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import ItemTypes from './ItemTypes';
import HTML5Backend from 'react-dnd-html5-backend';
// import { default as TouchBackend } from 'react-dnd-touch-backend';
import TemplateItem from './TemplateItem';
import LogicElement from './LogicElement';
import $ from "jquery";

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newId: 1,
      draggingId: null,
      editingId: null,
      lastDrag: {
        dragId: '',
        hoverId: '',
        leftOrRightOverHoverItem: ''
      },
      basicTemplateItems: [
        {
          type: 'operator',
          value: '+'
        },
        {
          type: 'operator',
          value: '-'
        },
        {
          type: 'operator',
          value: '/'
        },
        {
          type: 'operator',
          value: '*'
        },
        {
          type: 'comparison',
          value: '<'
        },
        {
          type: 'comparison',
          value: '>'
        },
        {
          type: 'comparison',
          value: '<='
        },
        {
          type: 'comparison',
          value: '>='
        },
        {
          type: 'comparison',
          value: '='
        },
        {
          type: 'number',
          value: 'Number'
        },
        {
          type: 'bracket',
          value: '( )'
        }
      ],
      componentTemplateItems: [],
      logicElements: []
    }
  }

  componentDidMount() {
    this.setState({
      newId: this.props.values.newId,
      componentTemplateItems: this.props.values.componentTemplateItems,
      logicElements: this.props.values.logicElements
    });
  }

  updateDragging = id => {
    this.setState({draggingId: id});
  }

  mousePositionOverHoverItem = (hoverId, monitor) => {
    const hoverElementProperties = $('#rule-builder-id-' + hoverId)[0].getBoundingClientRect();
    const centerOfElement = (hoverElementProperties.left + hoverElementProperties.width / 2);
    const mouseHorizontalPosition = monitor.getClientOffset().x;

    if (mouseHorizontalPosition < centerOfElement) {
      return 'left';
    } else if (mouseHorizontalPosition > centerOfElement) {
      return "right";
    };
  }

  moveElement = (props, monitor, dropTargetType) => {
    const dragItem = monitor.getItem();
    const dragId = dragItem.id;

    const hoverItem = props;
    const hoverId = hoverItem.id;

    // don't replace items with themselves
    if (dragId === hoverId) {
      return;
    }

    const leftOrRightOverHoverItem = this.mousePositionOverHoverItem(hoverId, monitor);

    // prevent function from executing if same as last drag
    if (this.state.lastDrag.dragId === dragId && this.state.lastDrag.hoverId === hoverId && this.state.lastDrag.leftOrRightOverHoverItem === leftOrRightOverHoverItem) return;

    const draggingItemType = monitor.getItemType();

    const functionList = {
      logicElement: this.moveLogicElement,
      bracket: this.moveLogicElement,
      templateItem: this.addAndDragItem
    };

    functionList[draggingItemType](hoverItem, dragItem, dropTargetType, leftOrRightOverHoverItem);
  }

  moveLogicElement = (hoverItem, dragItem, dropTargetType, leftOrRightOverHoverItem) => {
    const { logicElements } = this.state;
    const hoverId = hoverItem.id;
    const dragId = dragItem.id;

    // cancel if a dragging element is hovering over its own child
    if (this.getSingleElement(dragId).type === 'bracket' && this.hoverIsChildOfDrag(dragId, hoverId, logicElements)) return;

    const parentAndIndexOfDragging = this.getParentArrayAndIndex(dragId, logicElements);
    // clone the parent array to prevent mutating original object
    const draggingObject = JSON.parse(JSON.stringify(parentAndIndexOfDragging.parentArray[parentAndIndexOfDragging.index]));

    parentAndIndexOfDragging.parentArray.splice(parentAndIndexOfDragging.index, 1);

    const parentAndIndexOfHovering = this.getParentArrayAndIndex(hoverId, logicElements);
    const hoveringObject = parentAndIndexOfHovering.parentArray[parentAndIndexOfHovering.index];

    let insertIndex = null;

    if (dropTargetType === ItemTypes.LOGIC_ELEMENT) {
      insertIndex = leftOrRightOverHoverItem === 'left' ? parentAndIndexOfHovering.index : parentAndIndexOfHovering.index + 1;
      parentAndIndexOfHovering.parentArray.splice(insertIndex, 0, draggingObject);
    } else if (dropTargetType === ItemTypes.BRACKET) {
      insertIndex = leftOrRightOverHoverItem === 'left' ? 0 : hoveringObject.value.length;
      hoveringObject.value.splice(insertIndex, 0, draggingObject);
    };

    const lastDrag = {
      dragId,
      hoverId,
      leftOrRightOverHoverItem
    };

    this.setState({
      logicElements,
      lastDrag
    });
  }

  addAndDragItem = (hoverItem, dragItem, dropTargetType, leftOrRightOverHoverItem) => {
    const { newId, logicElements } = this.state;
    const hoverId = hoverItem.id;
    const dragId = dragItem.id;
    const dragIndex = dragItem.index;

    // redirect to move function if item has already been added to array
    if (dragId < newId) {
      this.moveLogicElement(hoverItem, dragItem, dropTargetType, leftOrRightOverHoverItem);
      return;
    };

    const newObject = this.constructNewObject(dragItem.templateItemType, dragIndex);
    newObject.id = newId;

    const parentAndIndexOfHovering = this.getParentArrayAndIndex(hoverId, logicElements);
    const hoveringObject = parentAndIndexOfHovering.parentArray[parentAndIndexOfHovering.index];

    let insertIndex = null;

    if (dropTargetType === ItemTypes.LOGIC_ELEMENT) {
      insertIndex = leftOrRightOverHoverItem === 'left' ? parentAndIndexOfHovering.index : parentAndIndexOfHovering.index + 1;
      parentAndIndexOfHovering.parentArray.splice(insertIndex, 0, newObject);
    } else if (dropTargetType === ItemTypes.BRACKET) {
      insertIndex = leftOrRightOverHoverItem === 'left' ? 0 : hoveringObject.value.length;
      hoveringObject.value.splice(insertIndex, 0, newObject);
    }

    const lastDrag = {
      dragId,
      hoverId,
      leftOrRightOverHoverItem
    };

    this.setState({
      logicElements,
      lastDrag,
      newId: this.state.newId + 1
    });
  }

  constructNewObject = (templateItemType, dragIndex) => {
    const { basicTemplateItems, componentTemplateItems } = this.state;

    let newObjectType = '';
    let newObjectValue = '';
    let newObjectColor = '';

    if (templateItemType === 'basic') {
      newObjectType = basicTemplateItems[dragIndex].type;

      newObjectValue = {
        number: '',
        operator: basicTemplateItems[dragIndex].value,
        comparison: basicTemplateItems[dragIndex].value,
        bracket: [],
      }[basicTemplateItems[dragIndex].type];
    } else if (templateItemType === 'component') {
      newObjectType = componentTemplateItems[dragIndex].type;
      newObjectValue = componentTemplateItems[dragIndex].value;
      newObjectColor = componentTemplateItems[dragIndex].color;
    };

    return {
      type: newObjectType,
      value: newObjectValue,
      color: newObjectColor
    };
  }

  getParentArrayAndIndex = (logicElementId, array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === logicElementId) {
        return {parentArray: array, index: i};
      };

      if (array[i].value.constructor === Array) {
        const nestedArray = this.getParentArrayAndIndex(logicElementId, array[i].value);
        if (nestedArray) return nestedArray;
      };
    };
  }

  getSingleElement = logicElementId => {
    const logicElementProperties = this.getParentArrayAndIndex(logicElementId, this.state.logicElements);

    return logicElementProperties.parentArray[logicElementProperties.index];
  }

  hoverIsChildOfDrag = (dragId, hoverId, array) => {
    const dragArray = this.getSingleElement(dragId).value;

    return this.getParentArrayAndIndex(hoverId, dragArray) !== undefined;
  }

  changeNumber = (logicElementId, newValue) => {
    if (!newValue) {
      this.setState({ editingId: logicElementId });
    } else {
      const { logicElements } = this.state;

      const parentArrayAndIndex = this.getParentArrayAndIndex(logicElementId, logicElements);
      parentArrayAndIndex.parentArray[parentArrayAndIndex.index].value = newValue;

      this.setState({
        editingId: null,
        logicElements
      });
    };
  }

  render() {
    const {
      basicTemplateItems,
      componentTemplateItems,
      logicElements,
      newId,
      draggingId,
      editingId
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
          {basicTemplateItems.map((templateItem, i) => (
            <TemplateItem
              index={i}
              key={i}
              newId={newId}
              type={templateItem.type}
              value={templateItem.value}
              templateItemType="basic"
              updateDragging={this.updateDragging}
            />
          ))}
        </div>
        <div style={style}>
          {componentTemplateItems.map((templateItem, i) => (
            <TemplateItem
              index={i}
              key={i}
              newId={newId}
              type={templateItem.type}
              value={templateItem.value}
              color={templateItem.color}
              templateItemType="component"
              updateDragging={this.updateDragging}
            />
          ))}
        </div>
        <hr />
        <div style={style}>
          {logicElements.map((card, i) => (
            <LogicElement
              key={card.id}
              id={card.id}
              type={card.type}
              value={card.value}
              color={card.color}
              moveElement={this.moveElement}
              draggingId={draggingId}
              updateDragging={this.updateDragging}
              editingId={editingId}
              changeNumber={this.changeNumber}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container);
// export default DragDropContext(TouchBackend)(Container);

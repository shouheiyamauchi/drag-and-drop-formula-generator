import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import DragDropFormula from './DragDropFormula'

class TouchScreenContainer extends Component {
  render() {
    return <DragDropFormula values={this.props.values} />
  }
}

export default DragDropContext(TouchBackend)(TouchScreenContainer);

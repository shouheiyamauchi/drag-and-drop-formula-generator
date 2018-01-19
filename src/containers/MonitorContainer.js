import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DragDropFormula from './DragDropFormula'

class MonitorContainer extends Component {
  render() {
    return <DragDropFormula values={this.props.values} />
  }
}

export default DragDropContext(HTML5Backend)(MonitorContainer);

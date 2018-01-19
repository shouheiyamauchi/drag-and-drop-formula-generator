import React from 'react';
import MonitorContainer from './containers/MonitorContainer';
import TouchScreenContainer from './containers/TouchScreenContainer';

const values = {
  logicElements: [
    '1', '+', '2', '*', ['1', '8', '*', [['9000']], '+', '@1', '+', '@2', '#2']
  ],
  componentTemplateItems: {
    '1': {
      value: 'Component 1',
      color: 'brown'
    },
    '2': {
      value: 'Component 2',
      color: 'orange'
    },
    '3': {
      value: 'Component 3',
      color: 'grey'
    }
  },
  variableTemplateItems: {
    '1': {
      value: 'Variable 1',
      color: 'green'
    },
    '2': {
      value: 'Variable 2',
      color: '#fff000'
    },
    '3': {
      value: 'Variable 3',
      color: 'pink'
    }
  }
}

const App = props => {
  return (
    <MonitorContainer values={values} />
    // <TouchScreenContainer values={values} />
  )
}

export default App;

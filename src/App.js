import React from 'react';
import DragDropFormula from './containers/DragDropFormula';

const values = {
  logicElements: [
    {
      value: '1'
    },
    {
      value: '2'
    },
    {
      value: [
        {
          value: '8'
        },
        {
          value: '9'
        },
        {
          value: [
            {
              value: '11'
            },
            {
              value: '12'
            },
          ],
        },
      ]
    },
    {
      value: '4'
    },
    {
      value: '5'
    },
    {
      value: '6'
    },
    {
      value: [
        {
          value: '14'
        },
        {
          value: '15'
        }
      ]
    },
    {
      value: '7'
    },
  ],
  componentTemplateItems: {
    1: {
      value: '@Component 1',
      color: 'brown'
    },
    2: {
      value: '@Component 2',
      color: 'orange'
    },
    3: {
      value: '@Component 3',
      color: 'grey'
    }
  },
  variableTemplateItems: {
    1: {
      value: '#Variable 1',
      color: 'green'
    },
    2: {
      value: '#Variable 2',
      color: '#fff000'
    },
    3: {
      value: '#Variable 3',
      color: 'white'
    }
  }
}

const App = props => {
  return (
    <DragDropFormula values={values} />
  )
}

export default App;

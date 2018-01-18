import React from 'react';
import DragDropFormula from './containers/DragDropFormula';

const values = {
  newId: 16,
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
  ],
  componentTemplateItems: [
    {
      type: 'component',
      value: 'Component 1',
      color: 'brown'
    },
    {
      type: 'component',
      value: 'Component 2',
      color: 'orange'
    },
    {
      type: 'component',
      value: 'Component 3',
      color: 'grey'
    }
  ],
  variableTemplateItems: [
    {
      type: 'variable',
      value: 'Variable 1',
      color: 'green'
    },
    {
      type: 'variable',
      value: 'Variable 2',
      color: '#fff000'
    },
    {
      type: 'variable',
      value: 'Variable 3',
      color: 'white'
    }
  ]
}

const App = props => {
  return (
    <DragDropFormula values={values} />
  )
}

export default App;

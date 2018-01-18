import React from 'react';
import Container from './Container';

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
  ]
}

const App = props => {
  return (
    <Container values={values} />
  )
}

export default App;

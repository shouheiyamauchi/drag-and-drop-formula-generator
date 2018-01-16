import React, { Component } from 'react';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TemplateItem from './TemplateItem'
import Card from './Card'

const style = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
}

class Container extends Component {
  constructor(props) {
    super(props);
    this.addAndDragItem = this.addAndDragItem.bind(this);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      newId: 8,
      templateItems: [
        {
          text: '+'
        },
        {
          text: '-'
        },
        {
          text: '/'
        },
        {
          text: '*'
        }
      ],
      cards: [
				{
					id: 1,
					text: 'Number 1',
          type: 'primary'
				},
				{
					id: 2,
					text: 'Number 2',
          type: 'primary'
				},
				{
					id: 3,
					text: [
            {
    					id: 8,
    					text: 'Number 10',
              type: 'primary'
    				},
    				{
    					id: 9,
    					text: 'Number 20',
              type: 'primary'
    				},
            {
    					id: 10,
    					text: [
                {
        					id: 11,
        					text: 'Number 10',
                  type: 'primary'
        				},
        				{
        					id: 12,
        					text: 'Number 20',
                  type: 'primary'
        				},
              ],
              type: 'bracket'
    				},
          ],
          type: 'bracket'
				},
				{
					id: 4,
					text: 'Number 4',
          type: 'primary'
				},
				{
					id: 5,
					text: 'Number 5',
          type: 'primary'
				},
				{
					id: 6,
					text: 'Number 6',
          type: 'primary'
				},
				{
					id: 7,
					text: 'Number 7',
          type: 'primary'
				},
			]
    }
  }

  moveCard(dragIndex, hoverIndex, leftOrRight) {
    const { cards } = this.state;

    if (leftOrRight === 'left') {
      const hoverCard = cards[hoverIndex]
      this.setState(
        update(this.state, {
          cards: {
            $splice: [[hoverIndex, 1], [dragIndex, 0, hoverCard]]
          }
        })
      )
    } else if (leftOrRight === 'right') {
      const dragCard = cards[dragIndex]
      this.setState(
        update(this.state, {
          cards: {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
          }
        })
      )
    }
  }

  addAndDragItem(dragItem, hoverIndex, leftOrRight) {
    const { newId, cards, templateItems } = this.state;

    if (dragItem.id < newId) {
      this.moveCard(cards.findIndex(card => card.id === dragItem.id), hoverIndex, leftOrRight)
      return
    }

    if (leftOrRight) {
      const insertIndex = leftOrRight === 'left' ? hoverIndex : hoverIndex + 1

      const newObject = {
        id: newId,
        text: templateItems[dragItem.index].text,
      }

      this.setState(
        update(this.state, {
          cards: {
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
    const { templateItems, cards, newId } = this.state

    return (
      <div>
        <div style={style}>
          {templateItems.map((templateItem, i) => (
            <TemplateItem
              key={i}
              index={i}
              text={templateItem.text}
              newId={newId}
            />
          ))}
        </div>
        <div style={style}>
          {cards.map((card, i) => (
            <Card
              key={card.id}
              index={i}
              id={card.id}
              type={card.type}
              text={card.text}
              moveCard={this.moveCard}
              addAndDragItem={this.addAndDragItem}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Container);

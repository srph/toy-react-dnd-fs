import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import classnames from 'classnames';

class DroppableHook extends Component {
  render() {
    if ( !this.props.droppable ) {
      return <div className='droppable-hook -undroppable' />;
    }

    return this.props.target(
      <div className={classnames('droppable-hook', {
        '-over': this.props.over
      })}/>
    );
  }
}

const target = {
  drop(props, monitor) {
    props.move({
      parent: monitor.getItem().parent,
      file: monitor.getItem().file,
      position: monitor.getItem().position
    }, {
      parent: props.parent,
      file: props.file,
      position: props.position
    });
  }

  // canDrop(props, monitor) {
  //   // return props.parent !== monitor.getItem().parent;
  // }
}

function collect(connect, monitor) {
  return {
    target: connect.dropTarget(),
    over: monitor.isOver(),
    droppable: monitor.canDrop()
  };
}

export default DropTarget('item', target, collect)(DroppableHook);
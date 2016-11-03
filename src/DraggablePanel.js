import React, {Component} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import classnames from 'classnames';

class DraggablePanel extends Component {
  render() {
    return this.props.target(
      this.props.source(
        <div className={classnames('item-panel-bar', { '-over': this.props.droppable && this.props.over })}>
          <div className="icon"></div>
          <h5 className="heading">{this.props.file.name}</h5>

          <div className="operations">
            {this.props.file.type === 'directory' && <div className={this.props.file.open ? 'caret-down' : 'caret-right'} />}
          </div>
        </div>
      )
    );
  }
}

const drag = {
  source: {
    beginDrag(props) {
      return {
        parent: props.parent,
        file: props.file,
        position: props.position
      };
    }
  },

  collect(connect, monitor) {
    return {
      source: connect.dragSource(),
      dragging: monitor.isDragging()
    };
  }
};


const drop = {
  target: {
    hover(props) {
      props.open();
    },

    drop(props, monitor) {
      props.move({
        parent: monitor.getItem().parent,
        file: monitor.getItem().file,
        position: monitor.getItem().position
      }, {
        file: props.file
      });
    },

    canDrop(props, monitor) {
      return props.file.type === 'directory' &&
        props.file.id !== monitor.getItem().file.id &&
        !this.props.descendant(props.file, monitor.getItem().file);
    }
  },

  collect(connect, monitor) {
    return {
      target: connect.dropTarget(),
      over: monitor.isOver(),
      droppable: monitor.canDrop()
    };
  }
};

export default DropTarget('item', drop.target, drop.collect)(
  DragSource('item', drag.source, drag.collect)(DraggablePanel)
);
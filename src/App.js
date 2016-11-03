import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classnames from 'classnames';
import DraggablePanel from './DraggablePanel';
import DroppableHook from './DroppableHook';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [{
        id: 1,
        type: 'directory',
        name: 'Untitled Folder',
        files: [2, 3, 4],
        open: false
      }, {
        id: 2,
        type: 'file',
        name: 'Untitled'
      }, {
        id: 3,
        type: 'file',
        name: 'Untitled 2'
      }, {
        id: 4,
        type: 'directory',
        name: 'Untitled Folder 2',
        files: [5],
        open: false
      }, {
        id: 5,
        type: 'file',
        name: 'Untitled 3',
      }, {
        id: 6,
        type: 'directory',
        name: 'Folder',
        files: [7, 8]
      }, {
        id: 7,
        type: 'file',
        name: 'Untitled 5'
      }, {
        id: 8,
        type: 'file',
        name: 'Jef-Sama-XXX'
      }],

      root: [1, 6]
    };
  }

  render() {
    return (
      <div className='main-sidebar'>
        {this.recursive(this.state.root, null)}
      </div>
    );
  }

  recursive(ids, parent) {
    return ids.map((id, i) => {
      const file = this.state.files.find((file) => file.id === id);

      const cn = classnames('item-panel', {
        '-directory': file.type === 'directory',
        '-closed': file.type === 'directory' && !file.open
      });

      return (
        <div
          onClick={(evt) => evt.stopPropagation() || this.toggle(id)}
          className={cn}
          key={id}>
          {i === 0 && <DroppableHook
            parent={parent}
            file={file}
            position={0}
            move={this.move.bind(this)}
            descendant={this.descendant.bind(this)} />}

          <DraggablePanel
            parent={parent}
            file={file}
            position={i}
            move={this.inside.bind(this)}
            open={() => file.type === 'directory' && !file.open && this.toggle(file.id)}
            descendant={this.descendant.bind(this)} />

          {file.type === 'directory' && !!file.files.length && this.recursive(file.files, id)}

          <DroppableHook
            parent={parent}
            file={file}
            position={file.type === 'directory' ? 0 : i + 1}
            move={this.move.bind(this)}
            descendant={this.descendant.bind(this)} />
        </div>
      );
    });
  }

  /**
   * Open/close directory
   */
  toggle(id) {
    this.setState({
      files: this.state.files.map((file) => {
        if ( file.id === id )
          file.open = !file.open;

        return file;
      })
    });
  }

  /**
   * src (keys: file, parent, position)
   * param (keys: file, parent, position)
   */
  move(src, dest) {
    const {files, root} = this.state;

    if ( src.parent == null ) {
      root.splice(src.position, 1);
    } else {
      files.find((file) => file.id === src.parent).files.splice(src.position, 1);
    }

    if ( dest.parent == null ) {
      root.splice(dest.position, 0, src.file.id);
    } else {
      files.find((file) => file.id === dest.parent).files.splice(dest.position, 0, src.file.id);
    }

    this.setState({
      files,
      root
    });
  }

  /**
   * src (keys: file, parent, position)
   * param (keys: file)
   */
  inside(src, dest) {
    const {files, root} = this.state;

    if ( src.parent == null ) {
      root.splice(src.position, 1);
    } else {
      files.find((file) => file.id === src.parent).files.splice(src.position, 1);
    }

    files.find((file) => file.id === dest.file.id).files.unshift(src.file.id);

    this.setState({
      files,
      root
    });
  }

  descendant(parent, file) {
    for ( let i = 0; i < parent.files; i++ ) {
      let current = current.find((file) => file.id === parent.files[i]);

      if ( current.id === file.id ) {
        return true;
      }

      if ( current.files && descendant(current, file) ) {
        return true;
      }
    }

    return false;
  }
}

export default DragDropContext(HTML5Backend)(App);
# chess-board
chess board is normal js app, but intended to use react like lifesycle, for mounting and updating components.
For now only static is board is ready, click event and keystrokes is soon going to add.

The below describes how we are planing, the definition of states are from `**w3schools**`. Will update on how we do, some flexibitlity is granted.

## Mounting Cycle
- `constructor()`:
    - The `constructor()` method is called before anything else, when the component is initiated, and it is the natural place to set up the initial state and other initial values.
- `getDerivedStateFromProps()` :  `# we are not using this for now`
    - The `getDerivedStateFromProps()` method is called right before rendering the element(s) in the board. This is the natural place to set the state object based on the initial props. It takes state as an argument, and returns an object with changes to the state.
- `render()`: 
    - The `render()` method is required, and is the method that actual outputs HTML to the board.
- `componentDidMount()`:
    - The `componentDidMount()` method is called after the component is rendered. This is where you run statements that requires that the component is already placed in the board.

## Updating Cycle
- `getDerivedStateFromProps()` :
    - Also at updates the getDerivedStateFromProps method is called. This is the first method that is called when a component gets updated This is still the natural place to set the state object based on the initial props.
- `shouldComponentUpdate()`
    - In the `shouldComponentUpdate()` method you can return a Boolean value that specifies whether React should continue with the rendering or not. The default value is true. The example below shows what happens when the `shouldComponentUpdate()` method returns false:
- `render()`:
    - The `render()` method is of course called when a component gets updated, it has to re-render the HTML to the board, with the new changes.
- `getSnapshotBeforeUpdate()`:
    - In the `getSnapshotBeforeUpdate()` method you have access to the props and state before the update, meaning that even after the update, you can check what the values were before the update. If the `getSnapshotBeforeUpdate()` method is present, you should also include the `componentDidUpdate()` method, otherwise you will get an error.
- `componentDidUpdate()`:
    - The componentDidUpdate method is called after the component is updated in the board.


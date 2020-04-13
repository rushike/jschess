# jschess
jschess is normal js app, but intended to use react like lifesycle, for mounting and updating components.
For now only static is board is ready, click event and keystrokes is soon going to add.

The below describes how we are planing.

## Getting Started
Include the following `jschess.min.js` or `jschess.js` in script tag
```html
    <script src="./dist/jschess.min.js"></script>
```

And add the following `html` and `js` snippet in `.html` file

```html
    <div id = "test" style="width: 60rem;height: 60rem;">

    </div>
    <script>
		$(document).ready(()=>{
            var game = new Game(props = {id : "test"})
		});
    </script>
```


You can get the [demo here](https://rushike.github.io/jschess)

## Changing Configuration
You can change  color of the board by `config.set_black_white` method in a script tag.
The below code set the color scheme to blue shades, you can play around to find your favriote combination
```js
config.set_black_white({
    black : "#0047b3",
    white : "#e6f0ff"
})
```

## How it works
### Mounting Cycle
- `constructor()`:
    - The `constructor()` method is called before anything else, when the component is initiated, and it is the natural place initial state and other initial values for Board, Game and Engine varibles are set.
- `getDerivedStateFromProps()` :  `# we are not using this for now`
    - The `getDerivedStateFromProps()` method is called right before rendering the element, we are not using this for now
- `render()`: 
    - The `render()` method is required, and is the method that actual outputs HTML Board.
- `componentDidMount()`:
    - The `componentDidMount()` method is called after the component is rendered. This is where you run statements that requires that the component is already placed in the board. It is useful for setting the optional things on board, example filling canvas by square names, etc.

### Updating Cycle
- `getDerivedStateFromProps()` :
    - It extract the meaningful data from the props, It can be used for props standardisation. We are not using this as of now.
- `shouldComponentUpdate()`
    - In the `shouldComponentUpdate()` method you can return a Boolean value that specifies whether `jschess` should continue with the rendering or not. The default value is true. This significanlt improves performance if not rendering the unchanged element. It is partially implemented.
- `rerender()`:
    - The `rerender()` method is of course called when a component gets updated, it has to re-render the HTML to the board, with the new changes. It different from the `render` by means render puts the things, and it updates the things.
- `getSnapshotBeforeUpdate()`:
    - In the `getSnapshotBeforeUpdate()` method you have access to the props and state before the update, meaning that even after the update, you can check what the values were before the update. Usefull in case you need to highligh the previous two moves. It will only store the previous state, so to have actual changes, you need to call `componentDidUpdate`.
- `componentDidUpdate()`:
    - The componentDidUpdate method is called after the component is updated in the board. Useful to set extra things, like if you want to highlight previous two moves. 



## Extras
`jschess` has `utils.js` which includes various different coding practices used, experimented while developing the `jschess`. 
- It includes the `convertor` class which has only static methods, useful for different scale conversion to pixels, like `vhtopixels`, etc. 
- `get` class which has method to returned the full page *height, width*, or height and width of just a **div**
- You can use `query` class, if you want to query on object created, for that you need to just add any object created to `objects` by calling `objects.add(this)`, with this you can use query methods on object to find all particular class instances etc.

Will soon create the proper documentation regarding the message formats, method descriptions etc. 
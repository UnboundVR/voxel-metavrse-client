# Programmable voxel-based sandbox

Build your own 3D space in the web with Minecraft-like simplicity and zero deployment efforts.

Using https://github.com/maxogden/voxel-engine (awesome stuff!).

## Get it running on your machine

The first time you set up, you should install the required npm packages:

```
npm install
```


Then run the watch (to auto-rebuild sass and js on each change):
```
npm run watch-client
```

Then point your browser to `http://localhost:<the port you chose above>` and have fun!

*Note: If you're using the Unbound VR Github App, you must use the port `1337`.*

## Controls
- When you start, click on the page to lock cursor. Press `<ESC>` to unlock cursor.
- `<W,A,S,D>` => move.
- `<R>` => toggle third person view.
- `Click` => destroy block.
- `<CONTROL> + click` => place block.
- `Right click` => edit the code of a block.

## License

BSD

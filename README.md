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
npm run watch
```

Then point your browser to `http://localhost:1337` and have fun!

## Controls
- When you start, click on the page to lock cursor. Press `<ESC>` to unlock cursor.
- `<W,A,S,D>` => move.
- `Click` => use current item.
- `<SHIFT> + click` => remove block.
- `Right click` => edit the code of a block.

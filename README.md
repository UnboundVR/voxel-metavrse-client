# Programmable voxel-based sandbox

Build your own 3D space in the web with Minecraft-like simplicity and zero deployment efforts.

Using https://github.com/maxogden/voxel-engine (awesome stuff!).

## Get it running on your machine

1) Install npm dependencies (first time only):

```
npm install
```

2) You should also create an '.env' file with the following fields:
```
SERVER_ADDRESS = <the URL where a server is currently running>
BITLY_ACCESS_TOKEN = <the bit.ly access token to shorten location sharing links (optional)>
```
*Tip: Copypasting/renaming '.env.template' file should be enough for a default/local setup*

3) Run + watch (to auto-rebuild sass and js on each change):
```
npm run watch
```

4) Navigate to `http://localhost:1337` and have fun!

## Controls
- When you start, click on the page to lock cursor. Press `<ESC>` to unlock cursor.
- `<W,A,S,D>` => move.
- `Click` => use current item.
- `<SHIFT> + click` => remove block.
- `Right click` => edit the code of a block.

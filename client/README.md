# type_C website

This is the front end of type_C, built with React, Vite and Tailwind. Setup and deploy steps are in the README in the main folder.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

While you're developing, every `/api` request goes to `http://localhost:5000`. If your API runs somewhere else, start it like this:

```bash
API_PROXY=http://localhost:5055 npm run dev
```

Where things are:

- `src/App.jsx` decides which screen shows and runs the game flow
- `src/assets/TypingGame.jsx` is the game itself. The `PACE` table near the top sets how fast aliens spawn and fall for each difficulty
- `src/api.js` is the one place that talks to the server
- `src/sound.js` makes all the sound effects with the Web Audio API, so there are no sound files

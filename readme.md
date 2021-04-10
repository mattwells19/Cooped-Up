<div style="display: flex; justify-content: center; align-items: center; margin: 2rem">
  <img width="125" src="./web/public/android-chrome-192x192.png"/>
  <div style="margin-left: 2rem">
    <h1 style="font-size: 3rem; margin: 0">Cooped Up</h1>
    <h2 style="font-size: 1.5rem; margin-top: 1rem">
      A web-based version of the popular card game <a href="http://indieboardsandcards.com/index.php/our-games/coup/">Coup</a>.
    </h2>
  </div>
</div>
<br/>

## Project Architecture

Frontend Framework: [React](https://reactjs.org/)

UI Library: [Chakra UI](https://github.com/chakra-ui/chakra-ui)

Build tool: [Snowpack](https://github.com/snowpackjs/snowpack)

Project managed on [Trello](https://trello.com/b/wQ1blugM/cooped-up)

## Running the Code

1. Clone the repo using `https://github.com/mattwells19/Cooped-Up.git`
2. Verify Node is installed by typing `node -v` in your console/terminal.
   1. If Node is not installed then install it [here](https://nodejs.org/en/download/).
   2. Make sure to include NPM (Node Package Manager) when installing.
3. Install `pnpm` using `npm i -g pnpm`
   1. `pnpm` is a monorepo package manager that helps with package depencies for multi-project repos such as this one.
4. Install dependencies with pnpm by typing `pnpm install`
5. Start the app by running `pnpm -r run start`.
   - If you are using VS Code then there is already a `launch.json` file that will run debugging for both projects. Simply go to the debugging tab, select `Start Project` and click Run.

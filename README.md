# Time-Capsule-Frontend

Welcome to Time-Capsule-Frontend

## Startup

Before you start. you should have your environment variables in `.env`.

## commands to run

To start the project, run `npm i` and `npm run server`. Use `npm run build` to build the project for production and `npm run preview` to preview it.

## things to know

The two checks put in place verify if you have run `npm run typecheck` and `npm run prettier`, which uses prettier to format all code, and to verify if all types are accounted for according to TypeScript. Your commit will not be 'accepted' by the action if your code is badly formatted or has TypeScript errors. To teach good practice, the actions will not change your code for you.

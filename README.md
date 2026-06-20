<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/vinsonio0920/blog-api">
    <img width="80" height="80" alt="crosshair-svgrepo-com" src="https://github.com/user-attachments/assets/39648cda-21d6-4f3c-9111-fb24be41ca84" />
  </a>

  <h3 align="center">Sniper</h3>
  <p align="center">
    The backend for the Where's Waldo website.
    <br />
  </p>
</div>

# wheres-waldo-backend

This is the backend and the core of the Where's Waldo app. It gives the frontend the missions, targets, and leaderboard entries along with the ability to edit the database accordingly. Target validation will also be done on the backend to prevent any cheating or tampering with the scores. In addition, the backend also keeps track of the user's session needed for tracking the time to complete the missions.

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#introduction-to-the-backend">Introduction to the backend</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li>
          <a href="#installation">Installation</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li>
          <a href="reading-missions,-targets,-and-leaderboard-entries">Reading missions, targets, and leaderboard entries</a>
        </li>
        <li>
          <a href="creating-missions,-targets,-and-leaderboard-entries">Creating missions, targets, and leaderboard entries</a>
        </li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgements">Acknowledgments</a></li>
    <li>
      <a href="#lessons-learned">Lessons Learned</a>
      <ul>
      </ul>
    </li>
  </ol>
</details>

## Introduction to the backend

In order to keep this project completed in a timely manner, the backend is tightly scoped and only deals with the core functionalities for now. It handles everything needed for a user to go from starting a mission, finding all the targets, and completing the mission with the time on the leaderboard.

The backend facilitates:
* Creating and reading missions, targets, and leaderboard entries
* Tracking the user's time through session and displaying the time upon completion
* Target validation 
* Cross origin requests
* And more!

This project is an exercise in creating a fully fledged fullstack project with Express and React. Think of it as a practice in actually doing the things a programmer would be asked to do for their jobs. The most important focus for the website was to be able to juggle both the frontend and backend at the same time. There is also the task of completing the website as intended and choosing which features to include and leave out as the project is being built. I have to say at the end that I'm pretty proud of what I've accomplished with this website, but there is still a long way to go before making a website worthy of keeping on my (metaphorical) shelf.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

These are the major framework and libraries used in creating the API. I greatly appreciate them in helping me make the API into what it is now!

* [![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](#)
* [![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
* [![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)
* [![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](#)
* ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To build on top of this project, follow the steps below to set up the project in your local environment!

### Prerequisites

* Make sure your package manager is updated to the latest version
  
  ```sh
  npm install npm@latest -g
  ```

* Install all dependencies

  ```sh
  npm install
  ```

* Create an SQL database to store your data in. Here I'll be using PostgreSQL, if you need to install it then feel free to follow [this guide](https://www.theodinproject.com/lessons/nodejs-installing-postgresql)!

  1. Enter into the PostgreSQL shell
  
    ```sh
      psql
    ```
    
  2. Create Where's Waldo database
     
    ```sh
      CREATE DATABASE wheres_waldo;
    ```
    
  3. Save the database address for later (environment variable)
     
    ```sh
      postgresql://<role_name>:<role_password>@localhost:5432/wheres_waldo
    ```
    
  Or you can also use a deployed database's connection string as well!



### Installation

1. Create an `.env` file in the `src` directory and add the following variables

  ```sh
  PORT=3000 (or any other port you want)
  DATABASE_URL="postgresql://<role_name>:<role_password>@localhost:5432/top_users" (or the deployed database connection string)
  SECRET="Your secret here"
  ORIGIN="Your frontend's origin here"
  ```

2. Run the build script to set up the Prisma ORM and initial database entries

  ```sh
  npx run build
  ```

3. Run the application

  ```sh
  node --watch app.js
  ```

And you're done! Feel free to test and play around with the API using cURL or an application like Postman!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Using the backend is actually quite easy and if you clone the frontend, it's very intuitive! The backend follows the REST API so if you are comfortable using any RESTful APIs before, then you'll feel right at home. The main usage features are as followed:

NOTE: Be sure to make all form datas into `x-www-form-urlencoded` or else it might not work!

### Reading missions, targets, and leaderboard entries

In order to read missions, all you have to do is to do a GET method with the correct URL. For missions that is `localhost:3001/missions/(missionId)` as an example, with the (missionId) being optional if you want to find a specific mission. For targets, it's `localhost:3001/missions/(missionId)/targets/(targetId)`, noting that missionId and targetId is required since targets are relational to specific missions! Finally, leaderboard entries are retrieved by `localhost:3001/missions/(missionId)/leaderboard`, again with missionId being required since the leaderboards are naturally relational to the missions!

### Creating missions, targets, and leaderboard entries

As for the creation of these missions, target, and leaderboard entries, you simply switch the methods to POST. Then, for creating missions the url is `localhost:3001/missions/`, targets is `localhost:3001/missions/(missionId)/targets`, and leaderboard being `localhost:3001/missions/(missionId)/leaderboard`. As for the body you can read the helpful error messages in order to find out the fields and the requirements for a successful POST! 

Do note that the leaderboard creation doesn't work currently in Postman it's tightly coupled with the session. To put it another way, right now the backend gets time from the session instead of the time being passed in the body. This makes POSTing a leaderboard entry in Postman error-prone. I'll be sure to fix it soon but I've exceeded the deadline I've set for this project. I apologize and will strive to do better.

As for validation and other small things, that's where the frontend comes over and orchestrates everything. These are pretty much the main things to know in order to use the backend. If you want to learn more, feel free to edit and update the code as you please. I hope that this backend is easy to navigate and use, but if it isn't know that I am working on getting better day by day. I'd appreciate your understanding!


<p align="right">(<a href="#readme-top">back to top</a>)</p>
   
## Roadmap

There is still many more features and polish that the backend could go through. For the purposes of completing this project in a timely manner, only the core functionalities were included. In the future I'll be adding many new features and fun stuff when I have the time. For now, here are the main things I would like to work on for the backend.

- [ ] Fix Render inactive website causing blank screen on frontends
- [ ] Update to allow images to be attached and pushed to something like Supabase
- [ ] Add image for targets
- [ ] Count numbers of snipes taken
- [ ] Add sound effects
- [ ] Update target states to be on the backend to prevent any hacking of the game
- [ ] Add loading screens
- [ ] X markers for invalid snipes and already found result para
- [ ] And much more!


<p align="right">(<a href="#readme-top">back to top</a>)</p>
     
## License 

Distributed under the GNU Affero General Public License v3.0 license. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgements

Along with the major frameworks and libraries, there are also some lesser libraries that I would like to give a shoutout to. Before we begin, I'm going to just shoutout StackOverflow and The Odin Project for helping me get here!

* [date-fns](https://date-fns.org/) - Without it, I'd probably be wasting precious time formatting dates!
* [Express cors](https://expressjs.com/en/resources/middleware/cors.html) - This middleware made it super easy to enable CORS between my backend and frontend domains
* [Express session](https://expressjs.com/en/resources/middleware/session/) - This middleware makes session storage easy and helpful! As it is, it's a must when you want to use sessions in Express!
* [Postman](https://www.postman.com/) - This tool, even in it's free tier, allowed me to do CRUD actions on the backend and save them for future backtracking
* [Prettier](https://prettier.io/) - I can't live without prettier. It helps take the burden of formatting code off my back
* [express-validator](https://express-validator.github.io/docs/) - Validating with Express has never been easier and more fun thanks to this library!
* [prisma-session-store](https://github.com/kleydon/prisma-session-store) - This package is what is used to keep track of the player's playing time on the backend with Prisma ORM. Basically it allows us to use Prisma for Express' session!
* [dotenv](https://www.npmjs.com/package/dotenv) - The popular environment variables package!
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template/blob/main/README.md?plain=1) - This is the README template I'm using to write out this Blog API README!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Lessons Learned

<p align="right">(<a href="#readme-top">back to top</a>)</p>

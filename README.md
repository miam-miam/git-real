
# GitReal.

The first place project for the University of Southampton 2024 Electronics and Computer Science Society hackathon (Fusion Hack)

## Screenshots

Main home page
![Main page](./images/main%20page.png)

Start page when it's ready to GitReal!
![Ready to start page](./images/ready%20page.png)

Challenge page, editor for your solution
![Challenge page](./images/challenge%20page.png)

View others' solutions and react to them
![Explore page](./images/explore%20page.png)

## Hackathon

The theme was "Fusion", where you had to fuse two or more ideas together to create a project.

We decided to fuse: Git, BeReal and competitive programming.

## Run Locally

- Ensure you have node.js and rust installed locally
- You will also need to have a postgres database running locally
- You will also need to have a github account and create a new OAuth app to get the client id and client secret

Clone the project

```bash
git clone https://github.com/miam-miam100/git-real
```

Go to the project directory

```bash
cd git-real
```

### Backend (Rust)

Go to the backend directory

```bash
cd backend
```

Make a .env file and fill in the environment variables 

```bash
cp .env.example .env
```

Start the backend

```bash
cargo run
```

### Frontend (Next.js)

Go to the frontend directory

```bash
cd ../frontend
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm run start
```

Go to http://localhost:3000

## Deployment

To deploy this project run

```bash
  npm run deploy
```

## The team

- [@miam-miam](https://github.com/miam-miam) Backend
- [@viktaur](https://github.com/viktaur) Backend
- [@Ortovoxx](https://github.com/Ortovoxx) Frontend


## Acknowledgements

 - [BeReal](https://bereal.com/en/) for the inspiration
 - [ECSS](https://society.ecs.soton.ac.uk/) for organising an amazing hackathon

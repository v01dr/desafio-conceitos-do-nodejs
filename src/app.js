const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel)
  next()
  console.timeEnd(logLabel)
}

function validateProjectId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' })
  }

  return next()
}

app.use(logRequests)
app.use('/repositories/:id', validateProjectId)


app.get("/repositories", (request, response) => {
  const { title } = request.query

  const results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories

  return response.json(results)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const id = uuid()
  const likes = 0
  const repository = { id, title, url, techs, likes }

  repositories.push(repository)

  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  const { title, url, techs } = request.body

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  const likes = repositories[repositoryIndex].likes

  repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)


});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  const title = repositories[repositoryIndex].title
  const url = repositories[repositoryIndex].url
  const techs = repositories[repositoryIndex].techs
  let likes = repositories[repositoryIndex].likes
  likes++

  repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)

});

module.exports = app;

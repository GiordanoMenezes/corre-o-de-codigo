const express = require('express');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  const repositoryidx = repositories.findIndex((repository) => repository.id === id);

  if (repositoryidx < 0) {
    return response.status(404).json({ error: 'Repository not found!' });
  }

  // if (repositories[repositoryidx].likes !== updatedRepository.likes) {
  //   return response.status(400).json({ error: 'You cannot change likes manually!' });
  // }
  console.log('updated:', updatedRepository);
  console.log('likes antes:', repositories[repositoryidx].likes);

  const repositorysave = {
    ...repositories[repositoryidx],
    ...updatedRepository,
    likes: repositories[repositoryidx].likes,
  };

  repositories[repositoryidx] = repositorysave;

  return response.json(repositorysave);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryidx = repositories.findIndex((repository) => repository.id === id);

  if (repositoryidx < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryidx, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  const likes = ++repository.likes;

  return response.json({ likes });
});

module.exports = app;

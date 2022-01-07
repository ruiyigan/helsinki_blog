const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Inferno",
        author: "Dan Brown",
        url: "www.google.com",
        likes: 10
    },
    {
        title: "Surrender Experiment",
        author: "Micheal A",
        url: "www.google.com",
        likes: 30        
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog(initialBlogs[0]).save()
    await Blog(initialBlogs[1]).save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  expect(titles).toContain(
    'Inferno'
  )
})

afterAll(() => {
  mongoose.connection.close()
})
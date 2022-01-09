const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of helper.initialBlogs) {
        await new Blog(blog).save()
    }
})

describe('blogs returning', () => {
    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, 50000000)
      
      test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
      
        expect(response.body).toHaveLength(helper.initialBlogs.length)
      })
      
      test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
      
        const titles = response.body.map(blog => blog.title)
        expect(titles).toContain(
          'Inferno'
        )
      })
}) 

describe('viewing a specific blog', () => {    
     test('a specific blog can be viewed', async () => {
      const blogsAtStart = await helper.blogsinDb()
    
      const blogAtView = blogsAtStart[0]
      
      const resultBlog = await api
        .get(`/api/blogs/${blogAtView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
      const processedBlogToView = JSON.parse(JSON.stringify(blogAtView))
    
      expect(resultBlog.body).toEqual(processedBlogToView)
    })
    test('checking blog got ID', async () => {
        const blogsAtStart = await helper.blogsinDb()
        const firstBlogId = blogsAtStart[0].id
        expect(firstBlogId).toBeDefined()
    })
    
    test('default like value to be 0', async () => {
        const newBlog = {
            title: "Jony Ive",
            author: "No Likes",
            url: "www.google.com",
        }
    
        const result = await api
                        .post('/api/blogs')
                        .send(newBlog)
                        .expect(201)
                        .expect('Content-Type', /application\/json/)
        const resultLikes = result.body.likes
        expect(resultLikes).toEqual(0)
    })
})

describe('addition of a new note', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "One Day",
            author: "Mitch Albom",
            url: "www.google.com",
            likes: 12
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
    
        const blogsAtEnd = await helper.blogsinDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).toContain(
            'One Day'
        )
    })
    
    test('blog without title is not added', async() => {
        const newBlog = {
            author: "James Patterson"
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsinDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsinDb()
        const blogToDelete = blogsAtStart[0]
      
        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)
      
        const blogsAtEnd = await helper.blogsinDb()
      
        expect(blogsAtEnd).toHaveLength(
          helper.initialBlogs.length - 1
        )
      
        const titles = blogsAtEnd.map(blog => blog.title)
      
        expect(titles).not.toContain(blogToDelete.content)
      })
})


afterAll(() => {
  mongoose.connection.close()
})
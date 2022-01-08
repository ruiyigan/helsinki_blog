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

const nonExistingID = async () => {
    const blog = new Blog({
        title: "One Day",
        author: "Mitch Albom",
        url: "www.google.com",
        likes: 17
    })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsinDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}


module.exports = {
    initialBlogs, nonExistingID, blogsinDb
}
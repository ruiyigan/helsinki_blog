const totalLikes = (blogs) => {
    function add(accumulator, blog) {
        return accumulator + blog.likes;
    }
    return blogs.reduce(add, 0)
}

const favourite = (blogs) => {
    function highest(currentTop, blog) {
        if (blog.likes > currentTop.likes) {
            return blog
        } else {
            return currentTop
        }
    }
    return blogs.reduce(highest, blogs[0])
}

const topAuthor = (blogs) => {
    const authors = new Map()
    blogs.forEach(blog => {
        const name = blog.author
        if (authors.has(name)) {
            const current = authors.get(name)
            authors.set(name, current + 1)
        } else {
            authors.set(name, 1)
        }
    })
    function highest(topAuthor, author) {
        if (author[1] > topAuthor[1]) {
            return author
        } else {
            return topAuthor
        }
    }
    const author_blogs = Array.from(authors).map(([author, blogs]) => ([author, blogs]))
    const [author, numOfBlogs] = author_blogs.reduce(highest, author_blogs[0])
    return {
        author: author,
        blogs: numOfBlogs
    }
}

module.exports = {
    totalLikes,
    favourite,
    topAuthor
}

// const palindrome = (string) => {
//     return string
//       .split('')
//       .reverse()
//       .join('')
//   }
  
// const average = (array) => {
//     const reducer = (sum, item) => {
//         return sum + item
//     }

//     return array.length === 0
//     ? 0
//     : array.reduce(reducer, 0) / array.length

// }
  
// module.exports = {
//     palindrome,
//     average,
// }
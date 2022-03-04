const { graphql, buildSchema } = require('graphql')

const model = require('./model') //Database

let DB
model.getDB().then(db => {DB=db})


const sse  = require('./utils/notifications') //Notifications
sse.start()


const schema = buildSchema(`
  type Query {
    users: [User]
    searchUser(blogId:ID!, q:String!):[User]
    events: [Event]
    searchEvent(q:String!):[Event]
    searchUsersInEvent(q:String!):[users]
    searchEventsInUsers(q:String!):[events]
  }
  type Mutation {
    addUser(identifier:ID!,name:String!,familyName:String!,birthDate:Int!,gender:String!,preferences:String!):User!
    addEvent(identifier:ID!,about:String!,startDate:Int!,location:String!,duration:Int!):Event!
  }
  type User{
    identifier: ID!
	  name: String
    familyName: String
    birthDate: Int
    gender: String
    preferences: [String]
  }

  type Event{
    identifier: ID!
	  about: String
    attendee: [User]
    startDate: Int
	  location: String
	  duration: Int
  }
`)


const rootValue = {
     users : () => DB.objects('User'),
     events:  () => DB.objects('Event'),
     searchEvent: ({ q }) => {
       q = q.toLowerCase()
       return DB.objects('Event').filter(x => x.title.toLowerCase().includes(q))
     },
     posts: ({ blogId }) => {
       return DB.objects('Post').filter(x => x.blog.title == blogId)
     },
     addPost: ({title, content, authorId, blogId}) => {

       let blog = DB.objectForPrimaryKey('Blog', blogId)
       let auth = DB.objectForPrimaryKey('User', authorId)
       let data = null
       
       if (blog && auth){
          data = {
                       title: title,
                       content: content,
                       author: auth,
                       blog: blog,
                       timestamp: new Date()
                      }

          DB.write( () => { DB.create('Post', data) }) 

          // SSE notification (same view as in graphQL)
          let post = {title: data.title, content: data.content, author: {name: data.author.name}, blog: {title: blog.title}}
          sse.emitter.emit('new-post', post)
       }

       return data
     }
}

exports.root   = rootValue
exports.schema = schema
exports.sse    = sse

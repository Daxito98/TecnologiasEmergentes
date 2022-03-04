const { graphql, buildSchema } = require('graphql')

const model = require('./model') //Database

let DB
model.getDB().then(db => {DB=db})


const sse  = require('./utils/notifications') //Notifications
sse.start()


const schema = buildSchema(`
  type Query {
    users: [User]
    events: [Event]
    searchUser(idUser:ID!):[User]
    searchEvent(idEvent:ID!):[Event]
    searchUsersInEvent(idEvent:ID!):[users]
    searchEventsInUser(idUser:ID!):[events]
  }
  
  type Mutation {
    addUser(identifier:ID!,name:String!,familyName:String!,birthDate:Int!,gender:String!,preferences:String!):User!
    addEvent(identifier:ID!,about:String!,startDate:Int!,location:String!,duration:Int!):Event!
  }
  
  type User{
    identifier: ID!
	name: String
    familyName: String
    performerIn: [Event]
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
     events : () => DB.objects('Event'),
     searchEvent: ({ idEvent }) => {
       return DB.objects('Event').filter(x => x.identifier.includes(idEvent))
     },
    searchUser: ({ idUser }) => {
        return DB.objects('User').filter(x => x.identifier.includes(idUser))
    },
    searchUsersInEvent: ({ idEvent }) => {
        return  DB.objects('Event').filter(x => x.identifier.includes(idEvent)).attendee
    },
    searchEventsInUser: ({ idUser }) => {
        return  DB.objects('User').filter(x => x.identifier.includes(idUser)).performerIn
    },
    addUser: ({identifier, name, familyName, birthDate, gender, preferences}) => {

        let user = {
            identifier: identifier,
            name: name,
            familyName: familyName,
            birthDate: birthDate,
            gender: gender,
            preferences: preferences,
            performerIn: []
        }

        DB.write( () => { DB.create('User', user) })

        // SSE notification (same view as in graphQL)
        let post = {identifier: user.identifier, name: user.name, familyName: user.familyName, birthDate: user.birthDate, gender: user.gender, preferences: user.preferences}
        sse.emitter.emit('new-post', post)
        return user
    },

    addEvent: ({identifier, about, startDate, location, duration}) => {

        let event = {
            identifier: identifier,
            about: about,
            attendee: [],
            startDate: startDate,
            location: location,
            duration: duration,

        }

        DB.write( () => { DB.create('Event', event) })

        // SSE notification (same view as in graphQL)
        let post = {identifier: event.identifier, about: event.about, startDate: event.startDate, location: event.location, duration: event.duration}
        sse.emitter.emit('new-post', post)
        return event
    }
}

exports.root   = rootValue
exports.schema = schema
exports.sse    = sse

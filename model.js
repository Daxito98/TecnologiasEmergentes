const Realm = require('realm')

let UserSchema = {
   name: 'User',
   primaryKey: 'identifier',
   properties: {
     identifier: 'int',
      name: 'string',
      familyName: 'string',
      birthDate: 'date',
      gender: 'string',
      preferences: '[string]'
   }
}

let EventSchema = {
  name: 'Event',
  primaryKey: 'identifier',
  properties: {
    identifier: 'int',
    about: 'string',
    atendee: '[User]', 
    startDate: 'date',
    location: 'string',
    duration: 'int'
  }
}

// // // MODULE EXPORTS

let config = {path: './data/blogs.realm', schema: [PostSchema, UserSchema, BlogSchema]}

exports.getDB = async () => await Realm.open(config)

// // // // // 

if (process.argv[1] == __filename){ //TESTING PART

  if (process.argv.includes("--create")){ //crear la BD

      Realm.deleteFile({path: './data/blogs.realm'}) //borramos base de datos si existe

      let DB = new Realm({
        path: './data/blogs.realm',
        schema: [PostSchema, UserSchema, BlogSchema]
      })
     
      DB.write(() => {
        let user = DB.create('User', {name:'user0', passwd:'xxx'})
        
        let blog = DB.create('Blog', {title:'Todo Motos', creator: user})
        
        let post = DB.create('Post', {
                                        title: 'prueba moto', 
                                        blog: blog, 
                                        content: 'esto es una prueba de motos',
                                        creator: user, 
                                        timestamp: new Date()})

        console.log('Inserted objects', user, blog, post)
      })
      DB.close()

  }
  else { //consultar la BD

      Realm.open({ path: './data/blogs.realm' , schema: [PostSchema, UserSchema, BlogSchema] }).then(DB => {
        let users = DB.objects('User')
        users.forEach(x => console.log(x.name))
        let blog = DB.objectForPrimaryKey('Blog', 'Todo Motos')
        if (blog)
           console.log(blog.title, 'by', blog.creator.name)
        DB.close()
      })
  }
  
}

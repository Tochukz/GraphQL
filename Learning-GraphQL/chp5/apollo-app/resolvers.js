const {users, photos, tags} = require('./data/test-data');
const {GraphQLScalarType} = require('graphql');

const resolvers = {
    Query : {
        totalPhotos: () =>  photos.length,
        allPhotos: () => photos
    },
    Mutation: {
        postPhoto(parent, args){ 
            const user = users.find(user => user.githubLogin === args.input.githubLogin);
            if(!user){
              throw new Error("Invalid githubLogin")
            }
            const newPhoto = {
                id: photos.length + 1,
                ...args.input,
                githubUser: user.githubLogin,
                created: new Date()
            }
            photos.push(newPhoto)
            return photos[photos.length-1]
        }
    },
    Photo: { // The parent argument will be a $photo object in the case
        url: parent => `http://localhost:4000/img/${parent.id}.jpg`, 
        postedBy: parent => users.find(user => user.githubLogin === parent.githubUser), 
        taggedUsers: parent => {
          //Filter out the userIDs from the photo
          let userIDs = tags.filter(tag => tag.photoID == parent.id)
                            .map(tag => tag.userID);
          return users.filter(user => userIDs.includes(user.githubLogin));
        }     
    },
    User: { // The parent argument will be a $user object in this case 
        postedPhotos: parent => photos.filter(photo => photo.githubUser === parent.githubLogin),
        /*
        inPhotos: parent => { 
          //Filter out the photoIDs where the user is tagged
          let photoIDs = tags.filter(tag => tag.userID === parent.githubLogin)
                             .map(tag => tag.photoID);
          //Filter out the photos having the photoIDs above
          return photos.filters(photo => photosIDs.includes(photo.id));          
        }
        */
        inPhotos: parent => tags.filter(tag => tag.userID == parent.githubLogin)
                                .map(tag => tag.photoID)
                                .map(photoID => photos.find(photo => photo.id === photoID))
    },
    DateTime: new GraphQLScalarType({ 
      name: 'DateTime',
      description: 'A valid date time value.',
      parseValue: value => new Date(value),
      serialize: value => new Date(value).toISOString(),
      parseLiteral: ast => ast.value //Abstract syntax tree (AST).
    })
    /**
     * When creating a custom scalar type, we need to add the three functions: serialize, parseValue, and parseLiteral, 
     * which will handle any fields or arguments that implement the DateType scalar.
     */
}
 
/**
 * This Photo resolver added to the root is called a trivial resolver. Trivial resolvers are added to the top level of the resolvers object, 
 * but they are not required. We have the option to create custom resolvers for the Photo object using a trivial resolver. If you do not specify a trivial resolver,
 * GraphQL will fall back to a default resolver that returns a property as the same name as the field. 
 * 
 * Note that only the url field is resolved here. 
 * All other fields are resolved by their corresponding keys in the Photo object(s) returned from allPhotos and postPhoto in Query and Mutation respectively.
 */


 module.exports = {resolvers};
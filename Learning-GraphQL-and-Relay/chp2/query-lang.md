# The Query Language
There are two kinds of operation - Query and Mutation and maybe Subscription in the future.  
## Query Operation
__Example 1: Find article with ID of 42 and it's list of comments.__    
```
query ArticleComments {
    article(articleID: 42) {
        comments {
            commendId
            formatedBody
            timestsmp
        }
    }
}
```
_article_ and _comments_ are __Complex Fields__ because the values of their corresponding property in the query response is either an object or an array of objects.    
A Complex field must have a sub selection i.e `{ }`  

__Example 2: Using a variable for query argument.__  
```
query ArticleComments($articleId: Int!) {
    article(articleId: $articleId) {
        comments {
            commentId
            formatedBody
            timestamp
        }
    }
}
```
The $article varible is defined as an _int_ type and is require and must not be null - `$article Int!`  
To execute this generic query, pass a JSON object for the _variables_: `{"articleId" : 42}`  
For HTTPP interface, the operation requestt can be sent using"    
`http://mywebsite.me/graphql?query={...}&variables={...}`  

### Directives
__Example 3: Using the @include and @skip directive.__
```
query ArticleComments($articleId Int!, $showEmail Boolean!) {
    article(articleId: $articleId) {
        comments {
            commentId
            formatedBody
            timestamp
            author {
               name
               authorEmail @include(if: $showEmail)
               authorWebsite @skip(if: $showEmail)
            }

        }
    }
}
```
It says, include _authorEmail_ field if `$showEmail` variable is `true` and skip _authorWebsite_ field of `$showEmail` variable id `true`  

__Example 4: Use Directive for complex field__  
```
query ArticleComments($articleId Int!, $showAuthor Boolean!) {
    article(articleId: $articleId) {
        commments {
            commentId
            formatedbody
            timestamp
            author @include(if: $showAuthor) {
               name
            }
        }
    }
}
```

### Alias
__Example 5: Use and alias for some field names__  
```
query ArticleComments($articleId: Int!) {
    post: article(articleId: $article) {
        responses: comments {
            responseId: commentId
            formatedBody
            timestamp
        }
    }
}
```
This query says: use the following  aliases  
 _post_ for article    
 alias _responses_ for _comments_ and  
 _reponseId_ for _commentId_  

 __Example 6: Use aliases to ask for the same field multiple times__
 ```
query TwoArticles {
        firstArticle: article(articleId: 42) {
            comments {
                commentId
                formattedBody
                timestamp
            }
        }
        secondArticle: article(articleId: 43) {
            comments {
                commentId
                formattedBody
                timestamp
            }
        }
}
```

### Fragments
Fragments are like partial operations that are generic and resuable.  
__Example 7: Using a fragment in place of the repeated comments complex feild in Example 6__
```
query TwoArticles {
    firstArticle: article(articleId: 42) {
        ...CommentList
    },
    secondAricle: article(articleId: 43) {
        ...CommentList
    }
    fragment CommentList on Article {
        comments {
            commentId
            formmatedBody
            timestamp
        }
    }
}
```
The _CommentList_ fragment is defined for use in the _article_ field.  
__Example 8: Defined fragment using directive and variable__
```
query AricleComment($articleId Int!, $showAuthor Boolean!) {
    article (articleId: $articleId) {
        ...CommentList
    }
    fragment CommentList on Article {
        comments {
            commentId
            formatedBody
            timestamp
            author @include(if: $showAuthor) {
                name
            }
        }
    }
}
```

__Example 9: Using inline fragments__
This inline fragment conditionally places a different value, articleId or commentId on the _nodeId_ property bases on the availability of either the Article or Comment named type.  
```
query ArticleOrComment {
    node(nodeId: 42) {
        ... on Article {
            nodeId: articleId
        }
        ... on Comment {
            nodeId: commentId
        }
        formattedBody
        timestamp
    }
}
```
The node is expected to be either an Article or a Comment.   
This query says use the fragment `{nodeId: articleId}` if the node is an _Article_ and use the fragment `{nodeId: commentId}` if the node is a _Comment_    

__Example 10: Using inline fragment to apply a directive to a group of fields__
```
query Article($showstats Boolean!) {
    article(articleId: 42) {
        title
        formatedBody
        ... @include(if: $showStats) {
            veiws
            likes
        }
    }
}
```
Note that the `on Type` section can be omitted in this format.  

## Mutation Operation
Mutations use field arguments as data input.  
Mutation able both reading and writing at the same time.  

__Example 11: Defining a basic mutation__   
```
mutation AddNewComment {
    addComment(
        articleId: 42,
        authorEmail: "markk@fb.com",
        markdown: "GrapQL is clearly a **game changer**"
    ) {
        id
        formatedBody
        timestamp
    }
}
```

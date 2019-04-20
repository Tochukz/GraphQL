# Query and Schema
To use GraphQL's introspection capability to find out about the schema and the feilds it support you can use the *__type* field in  GraphiQL interface. Note that 'People' is the name of a root Query:    
```   
query TypeFields {
  __type(name: "People") {
        fields {
            name
            description
            args {
                name
            }
        }
    }
}
```

**If you do not know the name of the root field you can use the __schema field to find it:**         
```
query QueryTypeName {
  __schema {
    queryType {
      name
    }
  }
}
```


**To read the list of directives a GraphQL server supports us the query:**      
```
query SchemaDirective {
  __schema {
    directives {
      name
      description
      args{
        name
        description
      }
    }
  }
}
```
  
**To read all the types for a schema use the ofType property like in the query:**   
```
query TypeFields {
    __schema {
        queryType {
            fields {
                name
                type {
                    kind
                    name,
                    ofType {
                        kind,
                        name
                    }
                }
            }
        }
    }
}
```

The GraphQL JavaScript reference implementation library has a built-in introspectionQuery that we can use to ask for a complete representation of the server's type system.  
You can find this query if you search the library's GitHub repo (https://github.com/graphql/graphql-js) for introspectionQuery .  


## Interface Type
#### Use GraphQLInterface to group fields that are common between two or more types
We define the PersonType, an Interface type and two types - EmployeeType and VendorType that implements the PersonType interface.    
```
const PersonType = new GraphQLInterfaceType({
    name: 'Person',
    fields: {
        name: {
            type: GraphQLString,
        }
    } 
});

const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: {
        name: {
            type: GrapQLString
        },
        departmentName: {
            type: GraphQLString
        }
    },
    interfaces:[PersonType]
});

const VendorType = new GraphQLObjectType({
    name: 'Vendor',
    fields: {
        name: {
            type: GrapQLString
        },
        companyName: {
            type: GraphQLString
        }
    },
    interfaces: [PersonType]
});

```
We now use the PersonType interface as a custom type.     
```
const ContactType = new GraphQLObjectType({
    name: 'Contact',
    fields: {
        person: PersonType,
        phoneNumber: {
            type: GraphQLString
        },
        emailAddress: {
            type: GraphQLString
        }
    }
});
```
Note that the _person_ property may get an EmployeeType or a VendorType since both types implements the PersonType interface and therefore satisfies the type requirement.

We can construct a query to ask about the _name_ field in the _person_ property .  
```
query ContactQuery {
    person {
        name
    },
    phoneNumber,
    emailAddress
}
```
To get other fields in the person property which in this case could be _departmentName_ or _companyName_ from EmployeeType or VendorType respectively, we can use conditional fragments.  
```
query ContactQuery {
    person {
        name
        ... on Employee {
            departmentName
        }
        ... on Vendor {
            companyName
        }
    },
    phoneNumber,
    emailAddress
}
```

## Union Type
#### Use Union type to group objects tha do not have any field in common
Now we define the ResumeSectionType, a union of EducationType and ExperinceType.  
```
const EducationType = new GraphhQLObjectType({
    name: 'Education',
    fields: () => ({
        schoolName: {
            type: GraphQLString
        },
        fieldOfStudy: {
            type: GraphQLString
        },
        graduationYear: {
            type: GraphQLInt
        }
    })
});

const ExperienceType = new GraphQLObjectType({
    name: 'Experience',
    fields: () => ({
        companyName: {
            type: GraphQLString,
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        }
    })
});

//Now the union type definition
const ResumeSectionType = new GraphQLUnionType({
    name: 'ResumeSection',
    types: [EducationType, ExperienceType],
    resolveType(value) {
        if (value instanceof ExperienceType) {
            return ExperienceType
        }
        if (value instanceof EducationType) {
            return EducationType
        }
    }
});
```
We can use inline fragments to conditionally query for fields on each type that makes up the union.  
```
query ResumeInformation {
   ResumeSection {
        ... on Education {
            schoolName,
            fieldOfStudy
        }
        ... on Experience {
            companyName,
            title
        }
   }
}
```

## Type Modifiers / Type makers
* GraphQLList
* GraphQLNonNull
```
const EmployeeType = GraphQLObjectType({
    name: 'Employee', 
    fields: {
        employeeId: {
            type: new GraphQLNotNullType(GraphQLInt)
        } 
    }
});

const EmployeesType = GraphQLObjectType({
    name: 'Employees', 
    fields: {
        employees: {
            type: new GraphQLList(EmployeeType)
        }
    }
});
```
They can be used to wrap other types to create a new type.  
Type modifiers can be combined. For example, we can use them to define a list of non-null items, a non-null list, or a list of lists.  

## Enums
Defining an Enum type:    
```
const ContractType = new GraphQLEnumType({
    name: 'Contract',
    values: {
        FULLTIME: {
            value: 1
        },
        PARTTIME: {
            value: 2
        },
        SHIFTWORK: {
            value: 3
        }
    }
});
```
Using the defined ContractType: 
```
const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: {
        name: {
            type: GraphQLString
        },
        contractType: ContractType
    }
});
``` 

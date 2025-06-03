import expresss from 'express';
import {query, validationResult, matchedData, checkSchema} from 'express-validator';
import {ValidationSchema} from './utils/Schema.mjs';
const app = expresss();

app.use(expresss.json());

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method}- ${req.url}`);    
    next();
}

const resolveIndexByUserById = (req,res,next) =>{
    const {params: {id}, body} = req;
    const parseId = parseInt(id);
    if (isNaN(parseId)) return res.status(400).send({msg:'Bad Request'});
    const findUserIndex = mockUsers.findIndex(user => user.id === parseId);
    if(findUserIndex === -1) return res.status(404).send({msg:'User not found'});
    req.index = findUserIndex;
    next();
}


const PORT = process.env.PORT || 3000;

const mockUsers= [
    {id:1, name:'John Doe',displayName: "Anson"},
    {id:2, name:'John',displayName: "Johnson"}, 
    {id:3, name:'annu',displayName: "Annu"}, 
    {id:4, name:'Jane',displayName: "Jane Doe"},
    {id:5, name:'Janu',displayName: "Janu"},
];

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.status(201).send({msg:'Hello World'});
});

app.get(
    '/api/users', 
    query('filter')
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({min:3, max:10})
    .withMessage('Filter must be between 3 and 10 characters long'),
(req, res) => {
    const result = validationResult(req);
    console.log(result);
    const {
        query: {filter, value}
    } = req;

    //when filter and value are undefined
    if(!filter && !value) return res.send(mockUsers);
    if(filter && value) 
        return res.send(
        mockUsers.filter(user => user[filter].includes(value))
    );
    return res.send(mockUsers);
})

app.post(
    "/api/users", 
    checkSchema(ValidationSchema),
      (req, res) => {

    const result = validationResult(req);
    console.log(result);
    if(!result.isEmpty())
        return res.status(400).send({errors :result.array()});
    const data = matchedData(req);
    const newuser = {
        id:mockUsers[mockUsers.length - 1].id+ 1,
        ...data
    }
    mockUsers.push(newuser);

    return res.send(newuser);
    
})





app.get('/api/users/:id', resolveIndexByUserById, (req, res) => {
    const {findUserIndex} = req ;
    const finduser = mockUsers[findUserIndex];
    if(!finduser) return res.status(404).send({msg:'User not found'});
    res.send(finduser);
 }) 

app.get('/api/products', (req, res) => {
    res.send([
        {id:123, name:'cheese'},
        {id:224, name:'chicken'}, 
        {id:321, name:'butter' }  

    ]);
})


app.put('/api/users/:id', resolveIndexByUserById,(req, res) => {
    const {params: {id}, index: findUserIndex, body} = req;
    const parseId = parseInt(id);
    mockUsers[findUserIndex] = {
        id: parseId,
        ...body
    }
    return res.sendStatus(200);
})

app.patch('/api/users/:id', resolveIndexByUserById,(req, res) => {
    const { body, findUserIndex} = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex],...body
    }
    return res.sendStatus(200);
})

app.delete('/api/users/:id', resolveIndexByUserById,(req, res) => {
    const {findUserIndex} = req;
    mockUsers.splice(findUserIndex);
    return res.sendStatus(200);
})
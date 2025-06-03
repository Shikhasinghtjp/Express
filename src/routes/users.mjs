import {Router} from "express";
import {query, validationResult,checkSchema,matchedData } from "express-validator";
import {ValidationSchema} from '../utils/Schema.mjs';

import {mockUsers} from '../utils/constants.mjs';
import {resolveIndexByUserById} from '../utils/middlewares.mjs';
const router = Router();

router.get("/api/users",
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
});

router.get('/api/users/:id', resolveIndexByUserById, (req, res) => {
    const {findUserIndex} = req ;
    const finduser = mockUsers[findUserIndex];
    if(!finduser) return res.status(404).send({msg:'User not found'});
    res.send(finduser);
 }) 

 router.post(
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

router.put('/api/users/:id', resolveIndexByUserById,(req, res) => {
    const {params: {id}, index: findUserIndex, body} = req;
    const parseId = parseInt(id);
    mockUsers[findUserIndex] = {
        id: parseId,
        ...body
    }
    return res.sendStatus(200);
})

router.patch('/api/users/:id', resolveIndexByUserById,(req, res) => {
    const { body, findUserIndex} = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex],...body
    }
    return res.sendStatus(200);
})

router.delete('/api/users/:id', resolveIndexByUserById,(req, res) => {
    const {findUserIndex} = req;
    mockUsers.splice(findUserIndex);
    return res.sendStatus(200);
})

export default router;
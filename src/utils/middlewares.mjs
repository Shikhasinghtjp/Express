import {mockUsers} from '../utils/constants.mjs';
export const resolveIndexByUserById = (req,res,next) =>{
    const {params: {id}, body} = req;
    const parseId = parseInt(id);
    if (isNaN(parseId)) return res.status(400).send({msg:'Bad Request'});
    const findUserIndex = mockUsers.findIndex(user => user.id === parseId);
    if(findUserIndex === -1) return res.status(404).send({msg:'User not found'});
    req.index = findUserIndex;
    next();
}

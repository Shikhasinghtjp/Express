import { Router} from "express";
const router = Router();

router.get('/api/products', (req, res) => {
    res.send([
        {id:123, name:'cheese'},
        {id:224, name:'chicken'}, 
        {id:321, name:'butter' }  

    ]);
})

export default router;
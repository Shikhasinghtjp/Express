import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import "./strategies/local-strategy.mjs";
import passport from "passport";
const app = express();

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(session({
    secret: "thakur",
    saveUninitialized: false,           //set to false so that memory can be saved bcz if set to true every single user session will be created even though they are visiting the website or not modified.
    resave: false,
    cookie: {                         //how long cookie live
        maxAge: 60000 *60,
        secure: false,
        sameSite: "lax"
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post('/api/auth', passport.authenticate("local"), (req,res)=>{});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
    console.log(req.session.id);
    // req.sessionStore.get(req.session.id, (err, sessionData) =>{
    //     if(err) {
    //         console.log(err);
    //         throw err;
    //     }
    //     console.log(sessionData);
    // })
    req.session.visited = true;
    res.cookie("hello", "world",{maxAge: 60000, signed: true});
    res.status(201).send({msg:"Hello"});
});

app.post('/api/auth',(req,res)=>{
    const {
        body: {username, password}
    }=req;
    const findUser = mockUsers.find(user => user.username === username && user.password === password); 
    if(!findUser || findUser.username !== username || findUser.password !== password) 
        return res.status(401).send({msg:'Bad Credentials'});
   

    req.session.user = findUser;
    return res.status(200).send(findUser);
});

app.get('/api/auth/status', (req,res)=>{
    req.sessionStore.get(req.sessionID,(err,session)=>{
        console.log(session);
    });
    return req.session.user 
    ? res.status(200).send(req.session.user)
     : res.status(401).send({msg:'Unauthorized'});
});

app.post('/api/cart', (req,res)=>{
    if(!req.session.user) return res.status(401);
    const {body: item } = req;
    const {cart} = req.session;
    if(cart){
        cart.push(item);
    }else{
        req.session.cart = [item];
    }
    return res.status(201).send(item);
});

app.get('/api/cart', (req,res)=>{
    if(!req.session.user) return res.status(401);
    return res.status(200).send(req.session.cart ?? []);
});




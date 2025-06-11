import passport from 'passport';
import {Strategy} from 'passport-local';
import {mockUsers} from '../utils/constants.mjs';
passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    console.log(`Inside deserializer: ${id}`);
    try{
        const user = mockUsers.find(user => user.id === id);
        if(!user) throw new Error("User not found");
        done(null,user);
    }catch(err){
        done(err, null);
    }
   
})


export default passport.use(
    new Strategy({usernameField: "email"},(username,password,done)=>{
        console.log(`Username:${username}, Password:
            ${password}`);
        try{
            const user = mockUsers.find(user => user.username === username);
            if(!user) 
                throw new Error("User not found");
           if(user.password !== password) 
                throw new Error("Incorrect password");
           done(null, user);          
        }catch(err){
            done(err, null);
        }
        
    })
);
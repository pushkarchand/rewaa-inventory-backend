const userDBA=require('../knex').User;
const knex = require('../knex/knex');
const uuidv1 = require('uuid/v1');
const passwordUtil=require('../utils/password');

exports.getUserDetails=(req,res)=>{
    const userId=req.params.customerId;
    return userDBA.findOne({"id":userId})
        .then(userDBAResponse=>{
            console.log(userDBAResponse);
            res.send(userDBAResponse);
        })
        .catch(err=>{
            console.log(err);
            res.writeHead(500);
            res.send(err);
        })
}


exports.updateUser=(req,res)=>{
    const userId=req.body.id;
    return userDBA.update({"id":userId})
        .then(userDBAResponse=>{
            console.log(userDBAResponse);
            res.send(userDBAResponse);
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
}


exports.createUser=(req,res)=>{
    const user=req.body;
    user.id=uuidv1();
    return userDBA.findOne({'emailId':user.emailId})
    .then(uniqueEmailRespose=>{
        if(uniqueEmailRespose){
            res.send({"message":"Email Id is already taken"});
        } else{
            return passwordUtil.encryptPassword(user.password)
            .then(response=>{
                user.password=response;
            })
            .then(()=>{
                return userDBA.create(user)
            })
            .then(userDBAResponse=>{
                console.log(userDBAResponse);
                res.send(userDBAResponse);
            })
        }
    })
    .catch(err=>{
        console.log(err); 
        res.send(err);
    })
}

exports.enumerateUsers=(req,res)=>{
    const userId=req.params.customerId;
    return userDBA.find()
        .then(userDBAResponse=>{
            console.log(userDBAResponse);
            res.send(userDBAResponse);
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
}


exports.removeUser=(req,res)=>{
    const userIds=req.params.id.split(',');
   return knex('user')
    .whereIn('id', userIds)
    .del()
    .then(deleteResponse=>{
        res.send(deleteResponse);
    })
    .catch(err=>{
        console.log(err);
        res.send(err);
    })
}
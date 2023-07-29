const users = require('../models/users.model');

//Displaying favourites
exports.view = async (user_id)=>{

    return users.find({_id: user_id});
}

//Add hotel_id to the favourites if it is present in the hotel Collection
exports.add = async (user_id,hotel_id)=>{
    return users.findByIdAndUpdate(user_id,{$push:{favouriteHotels: hotel_id}},{ new: true });
}
 
//remove hotel_id from the favourites if it is present   
exports.remove = async (user_id,hotel_id)=>{
        
        console.log(result)

                return users.findByIdAndUpdate(user_id,{$pull:{favouriteHotels: hotel_id}},{ new: true });
        }


// recent searches

exports.recent = async (user_id,hotel_id)=>{
    const result = await users.find({_id:user_id},{recentVisitsOfHotels:1,_id:0})
    const recents = result[0].recentVisitsOfHotels;
    console.log(recents)
    if (recents.includes(hotel_id)){
        return result[0]
    }
    else{
        console.log(recents.length)
        if(recents.length>9){
            const after_popped= await users.findByIdAndUpdate(user_id,{$pop:{recentVisitsOfHotels:-1}},{ new: true });
            console.log(after_popped.recentVisitsOfHotels)
        }
        return User.findByIdAndUpdate(user_id,{$push:{recentVisitsOfHotels: hotel_id}},{ new: true });
    }
    
}
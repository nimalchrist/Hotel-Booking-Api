const users = require('../models/users.model');

//Displaying favourites
exports.view = async (user_id)=>{
    return await users.find({_id: user_id},{favouriteHotels:1,_id:0}).populate('favouriteHotels');
    
}

//Add hotel_id to the favourites if it is present in the hotel Collection
exports.add = async (user_id,hotel_id)=>{
    //finding if the hotel is already present in the list 
    const result = await users.find({_id:user_id},{favouriteHotels:1,_id:0})
    const output = result[0].favouriteHotels;
    //if already present ingore push operation 
    if (output.includes(hotel_id)){
        return result[0]
    }
    else{
        //if not present push into array
        return await users.findByIdAndUpdate(user_id,{$push:{favouriteHotels: hotel_id}},{ new: true });
    }
}
 
//remove hotel_id from the favourites if it is present   
exports.remove = async (user_id,hotel_id)=>{
    return await users.findByIdAndUpdate(user_id,{$pull:{favouriteHotels: hotel_id}},{ new: true });
}


// recent searches

exports.recent = async (user_id,hotel_id)=>{
    const result = await users.find({_id:user_id},{recentVisitsOfHotels:1,_id:0})
    const recents = result[0].recentVisitsOfHotels;
    //if already present ingore push operation 
    if (recents.includes(hotel_id)){
        return result[0]
    }
     //if not present push into array
    else{
        // the array limit for recent visits is 10. So if array size exceeds, delete the last one and insert new hotel 
        if(recents.length>9){
            const after_popped= await users.findByIdAndUpdate(user_id,{$pop:{recentVisitsOfHotels:-1}},{ new: true });
            console.log(after_popped.recentVisitsOfHotels)
        }
        // if size is in the limit, just add the hotel_id
        return await users.findByIdAndUpdate(user_id,{$push:{recentVisitsOfHotels: hotel_id}},{ new: true });
    }
    
}
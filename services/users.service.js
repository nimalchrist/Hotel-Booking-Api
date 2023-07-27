// TODO the services of users collection
const Hotel = require('../models/hotel.model');
const User = require('../models/user.model');

exports.view = async (user_id)=>{
    return await User.find({_id: user_id},{favouriteHotels:1,_id:0});
}

exports.add = async (user_id,hotel_id)=>{
    const result = await Hotel.findById(hotel_id)
        if(result==null){
            return 0
        }
        else{
            return User.findByIdAndUpdate(user_id,{$push:{favouriteHotels: hotel_id}},{ new: true });
        }
    }
    
exports.remove = async (user_id,hotel_id)=>{
        const result = await User.find({favouriteHotels:{$in:[hotel_id]}})
        console.log(result)
            if(result.length==0){
                return 0
            }
            else{
                return User.findByIdAndUpdate(user_id,{$pull:{favouriteHotels: hotel_id}},{ new: true });
            }
        }

exports.delete = async (user_id,hotel_id)=>{
    return User.findByIdAndUpdate(user_id,{$pull:{favorites: hotel_id}},{ new: true });
}

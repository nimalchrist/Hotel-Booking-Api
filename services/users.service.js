// TODO the services of users collection
const usersModel = require("../models/users.model");
const encryptionUtil = require('../utils/utils');
const { decrypt } = require('../utils/utils');


exports.findAcountCredentials = async (field, value) => {
  let query = {};
  query[field] = value;
  try {
    const user = await usersModel.findOne(query, {
      userName: 1,
      email: 1,
      phoneNumber: 1,
      password: 1,
    });
    return user;
  } catch (error) {
    console.log("Error occurred while finding user: ", error);
    throw error;
  }
};

exports.findFacebookAccountCredentials = async (facebookId) => {
  try {
    const user = await usersModel.findOne({ faceBookId: facebookId });
    return user;
  } catch (error) {
    console.log("Error occurred while finding user: ", error);
    throw error;
  }
};

exports.createUser = async (userData) => {
  const newUser = new usersModel(userData);
  await newUser.save();
  return newUser;
};
//Displaying favourites
exports.view = async (user_id)=>{
    return await usersModel.find({_id: user_id},{favouriteHotels:1,_id:0}).populate('favouriteHotels');
}

//Add hotel_id to the favourites if it is present in the hotel Collection
exports.add = async (user_id,hotel_id)=>{
    //finding if the hotel is already present in the list 
    const result = await usersModel.find({_id:user_id},{favouriteHotels:1,_id:0})
    const output = result[0].favouriteHotels;
    //if already present ingore push operation 
    if (output.includes(hotel_id)){
        return result[0]
    }
    else{
        //if not present push into array
        return await usersModel.findByIdAndUpdate(user_id,{$push:{favouriteHotels: hotel_id}},{ new: true });
    }
}

//remove hotel_id from the favourites if it is present   
exports.remove = async (user_id,hotel_id)=>{
    return await usersModel.findByIdAndUpdate(user_id,{$pull:{favouriteHotels: hotel_id}},{ new: true });
}

exports.recent = async (user_id,hotel_id)=>{
    const result = await usersModel.find({_id:user_id},{recentVisitsOfHotels:1,_id:0})
    const recents = result[0].recentVisitsOfHotels;
    //if already present ingore push operation 
    if (recents.includes(hotel_id)){
        return await usersModel.find({_id:user_id},{recentVisitsOfHotels:1,_id:0}).populate('recentVisitsOfHotels');
    }
     //if not present push into array
    else{
        // the array limit for recent visits is 10. So if array size exceeds, delete the last one and insert new hotel 
        if(recents.length>9){
            const after_popped= await usersModel.findByIdAndUpdate(user_id,{$pop:{recentVisitsOfHotels:-1}},{ new: true });
            console.log(after_popped.recentVisitsOfHotels)
        }
        // if size is in the limit, just add the hotel_id
       await usersModel.findByIdAndUpdate(user_id,{$push:{recentVisitsOfHotels: hotel_id}},{ new: true }).populate('recentVisitsOfHotels');
       return this.recent_search1(user_id);
    }
    
}

//listing recent_searches when user logins 
exports.recent_search1 = async (user_id)=>{
  return await usersModel.find({_id: user_id},{recentVisitsOfHotels:1,_id:0}).populate('recentVisitsOfHotels');
}

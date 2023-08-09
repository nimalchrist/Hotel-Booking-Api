// TODO the services of users collection
const usersModel = require("../models/users.model");
const encryptionUtil = require("../utils/utils");
const { decrypt } = require("../utils/utils");

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

// profile updation service
exports.updateUser = async (userId, updates) => {
  try {
    const user = await usersModel.findById(userId);

    if (!user) {
      return { message: "User not found", error: true };
    }

    // Check if the email is being updated and if it's unique
    if (updates.email && updates.email !== user.email) {
      const existingUserWithEmail = await usersModel.findOne({
        email: updates.email,
      });
      if (
        existingUserWithEmail &&
        existingUserWithEmail._id.toString() !== userId
      ) {
        return { message: "Email is already in use", error: true };
      }
    }

    // Check if the phoneNumber is being updated and if it's unique
    if (updates.phoneNumber && updates.phoneNumber !== user.phoneNumber) {
      const existingUserWithPhoneNumber = await User.findOne({
        phoneNumber: updates.phoneNumber,
      });
      if (
        existingUserWithPhoneNumber &&
        existingUserWithPhoneNumber._id.toString() !== userId
      ) {
        return { message: "Phone number is already in use", error: true };
      }
    }

    // Update other fields
    for (const key in updates) {
      if (key !== "email" && key !== "phoneNumber") {
        if (key === "password") {
          // Encrypt the password if it exists in the updates object
          user[key] = encryptionUtil.encrypt(updates[key]);
        } else {
          user[key] = updates[key];
        }
      }
    }

    // Save the updated user
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    return { message: "Phone number is already in use", error: true };
  }
};

// get profile info
exports.getProfileInfo = async (user_id, detailsFor) => {
  if (detailsFor == "navbar") {
    return await usersModel.findOne(
      { _id: user_id },
      { profilePicture: 1, userName: 1 }
    );
  } else {
    return await usersModel.findOne(
      { _id: user_id },
      {
        userName: 1,
        email: 1,
        password: 1,
        phoneNumber: 1,
        address: 1,
        dateOfBirth: 1,
        _id: 0,
      }
    );
  }
};

//upload image
exports.uploadImage = async (user_id, type, filename) => {
  try {
    const user = await usersModel.findById(user_id);
    console.log(user);
    if (!user) {
      return { success: false };
    }
    if (type == "profile") {
      user.profilePicture = `http://localhost:3200/profiles/${filename}`;
    } else {
      user.coverPicture = `http://localhost:3200/profiles/${filename}`;
    }

    console.log(user);
    await user.save();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

exports.getImage = async (user_id, type) => {
  const user = await usersModel.findById({ _id: user_id });
  if (type == "profile") {
    if (user.profilePicture) {
      return user.profilePicture;
    } else {
      return null;
    }
  } else {
    if (user.coverPicture) {
      return user.coverPicture;
    } else {
      return null;
    }
  }
};

//Displaying favourites
exports.view = async (user_id) => {
  return await usersModel
    .find({ _id: user_id }, { favouriteHotels: 1, _id: 0 })
    .populate("favouriteHotels");
};

//Add hotel_id to the favourites if it is present in the hotel Collection
exports.add = async (user_id, hotel_id) => {
  //finding if the hotel is already present in the list
  const result = await usersModel.find(
    { _id: user_id },
    { favouriteHotels: 1, _id: 0 }
  );
  const output = result[0].favouriteHotels;
  //if already present ingore push operation
  if (output.includes(hotel_id)) {
    return result[0];
  } else {
    //if not present push into array
    return await usersModel.findByIdAndUpdate(
      user_id,
      { $push: { favouriteHotels: hotel_id } },
      { new: true }
    );
  }
};

//remove hotel_id from the favourites if it is present
exports.remove = async (user_id, hotel_id) => {
  return await usersModel.findByIdAndUpdate(
    user_id,
    { $pull: { favouriteHotels: hotel_id } },
    { new: true }
  );
};

exports.recent = async (user_id, hotel_id) => {
  const result = await usersModel.find(
    { _id: user_id },
    { recentVisitsOfHotels: 1, _id: 0 }
  );
  const recents = result[0].recentVisitsOfHotels;
  //if already present ingore push operation
  if (recents.includes(hotel_id)) {
    return await usersModel
      .find({ _id: user_id }, { recentVisitsOfHotels: 1, _id: 0 })
      .populate("recentVisitsOfHotels");
  }
  //if not present push into array
  else {
    // the array limit for recent visits is 10. So if array size exceeds, delete the last one and insert new hotel
    if (recents.length > 9) {
      const after_popped = await usersModel.findByIdAndUpdate(
        user_id,
        { $pop: { recentVisitsOfHotels: -1 } },
        { new: true }
      );
      console.log(after_popped.recentVisitsOfHotels);
    }
    // if size is in the limit, just add the hotel_id
    await usersModel
      .findByIdAndUpdate(
        user_id,
        { $push: { recentVisitsOfHotels: hotel_id } },
        { new: true }
      )
      .populate("recentVisitsOfHotels");
    return this.recent_search1(user_id);
  }
};

// Fetch user details by ID along with decrypted card details
exports.getUserCardDetails = async (userId) => {
  try {
    // Find the user by user ID and project only the addedCards field
    const user = await usersModel.findOne({ _id: userId }, { addedCards: 1 });

    if (!user) {
      return { error: "User not found." };
    }

    // Check if the user has saved cards
    if (user.addedCards.length > 0) {
      // Decrypt the card details in the addedCards field
      const decryptedCards = user.addedCards.map((addedCard) => ({
        cardHolder: addedCard.cardHolder,
        cardNumber: decrypt(addedCard.cardNumber),
        expirationDate: addedCard.expirationDate,
        cvv: decrypt(addedCard.cvv),
        cardName: addedCard.cardName,
      }));
      return decryptedCards;
    } else {
      // If the user has no saved cards, return a message
      return { message: "No saved cards." };
    }
  } catch (err) {
    return { error: err.message };
  }
};

// Fetch all users along with decrypted card details
exports.getAllUsersWithDecryptedCards = async () => {
  try {
    const users = await usersModel.find();

    // Decrypt the card details in the addedCards field for all users
    const usersWithDecryptedCards = users.map((user) => ({
      ...user.toObject(),
      addedCards: user.addedCards.map((addedCard) => ({
        cardHolder: addedCard.cardHolder,
        cardNumber: decrypt(addedCard.cardNumber),
        expirationDate: addedCard.expirationDate,
        cvv: decrypt(addedCard.cvv),
        cardName: addedCard.cardName,
      })),
    }));

    return { data: usersWithDecryptedCards };
  } catch (err) {
    return { error: err.message };
  }
};

// Function to add new card details to the addedCards field
exports.addNewCard = async (userId, cardDetails) => {
  const { cardHolder, cardNumber, expirationDate, cvv } = cardDetails;

  // Encrypt the CVV and card number before saving
  const encryptedCvv = encryptionUtil.encrypt(cvv);
  const encryptedCardNumber = encryptionUtil.encrypt(cardNumber);

  // Determine the card name based on the first digit of the card number
  let cardName;
  switch (cardNumber.charAt(0)) {
    case "4":
      cardName = "Visa";
      break;
    case "5":
      cardName = "MasterCard";
      break;
    case "3":
      cardName = "American Express";
      break;
    case "6":
      cardName = "Discover";
      break;
    default:
      cardName = "Unknown";
  }

  // Create the new card object with encrypted data
  const newCard = {
    cardHolder: cardHolder,
    cardNumber: encryptedCardNumber,
    expirationDate: expirationDate,
    cvv: encryptedCvv,
    cardName: cardName,
  };

  try {
    // Find the existing user by user ID
    const existingUser = await usersModel.findOne({ _id: userId });
    if (!existingUser) {
      return { error: "User not found." };
    }

    // Update the user document to append the new card to addedCards array
    existingUser.addedCards.push(newCard);
    await existingUser.save();

    return { message: "Card details saved successfully." };
  } catch (err) {
    return { error: err.message };
  }
};

//listing recent_searches when user logins
exports.recent_search1 = async (user_id) => {
  return await usersModel
    .find({ _id: user_id }, { recentVisitsOfHotels: 1, _id: 0 })
    .populate("recentVisitsOfHotels");
};

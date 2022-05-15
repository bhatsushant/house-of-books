const mongoCollections = require('../config/mongoCollection');
const users = mongoCollections.users;
const books = mongoCollections.books;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const { ObjectId } = require('mongodb');
const booksFunctions = require('./books');

stateList = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
];

function checkIsString(s) {
    if (typeof s !== 'string') throw 'Given input is invalid';
    if (s.length < 1) throw 'Given input is empty';
    if (s.trim().length === 0) throw 'Given input is all white spaces';
}

function checkIsName(s) {
    const nameRegex = /[^a-zA-Z]/;
    if (nameRegex.test(s)) throw 'Given input is not only letters';
}

function checkIsPassword(s) {
    if (s.length < 8) throw 'Given password size is less than 8';
}

function checkIsEmail(s) {
    const emailRegex = /^\S+@[a-zA-Z]+\.[a-zA-Z]+$/;
    if (!emailRegex.test(s)) throw 'Given email id is invalid';
}

function checkIsUsername(s) {
    if (s.length < 4) throw 'Given username size is less than 4';
}

function checkPhoneNumber(s) {
    const phoneRegex = /^\d{10}$/im;
    if (!phoneRegex.test(s)) throw 'Incorrect phone number format';
}

function checkZip(s) {
    const zipRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    if (!zipRegex.test(s)) throw 'Incorrect zip code format';
}

function validateID(id) {
    if (typeof id != 'string') {
        throw 'Argument of type string expected';
    }
    if (id.trim().length === 0) {
        throw 'String cannot be blanks or empty';
    }
    if (!ObjectId.isValid(id)) {
        throw 'Object Id is not valid';
    }
}

async function createUser(
    firstName,
    lastName,
    email,
    phoneNumber,
    username,
    password,
    address,
    city,
    state,
    zip,
    flag,
    image
) {
    console.log('Inside create user flag is ', flag);
    if (flag === 'G') {
        if (!email) throw 'Must provide the email';
        email = email.toLowerCase().trim();
        try {
            checkIsEmail(email);
        } catch (e) {
            throw String(e);
        }
    } else {
        console.log('Inside else of create user');
        if (!firstName) throw 'Must provide the first name';
        if (!lastName) throw 'Must provide the last name';
        if (!email) throw 'Must provide the email';
        if (!username) throw 'Must provide the username';
        if (!password) throw 'Must provide the password';
        if (!phoneNumber) throw 'Must provide the phone number';
        if (!address) throw 'Must provide the address';
        if (!city) throw 'Must provide the city';
        if (!state) throw 'Must provide the state';
        if (!zip) throw 'Must provide the zip';

        firstName = firstName.trim();
        lastName = lastName.trim();
        email = email.toLowerCase().trim();
        username = username.toLowerCase().trim();
        password = password.trim();
        phoneNumber = phoneNumber.trim();
        address = address.trim();
        city = city.trim();
        state = state.trim();
        zip = zip.trim();

        try {
            checkIsString(firstName);
            checkIsString(lastName);
            checkIsString(email);
            checkIsString(username);
            checkIsString(password);
            checkIsString(address);
            checkIsString(city);
            checkIsString(state);
            checkIsString(zip);
            checkZip(zip);

            checkIsName(firstName);
            checkIsName(lastName);

            checkIsEmail(email);
            checkPhoneNumber(phoneNumber);
            checkIsUsername(username);
            checkIsPassword(password);
        } catch (e) {
            console.log(e);
            throw String(e);
        }
    }

    const userCollection = await users();

    if (await userCollection.findOne({ email: email })) throw 'Email is taken.';

    let hash = null;
    if (flag !== 'G') {
        hash = await bcrypt.hash(password, saltRounds);
        found = false;

        for (let i = 0; i < stateList.length; i++) {
            if (state == stateList[i]) found = true;
        }

        if (found == false) {
            throw `State not found`;
        }
    }

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        username: username,
        password: hash,
        address: address,
        city: city,
        state: state,
        zip: zip,
        bookRenting: [],
        purchasedBooks: [],
        reviews: [],
        whishlist: [],
        image: image,
    };

    console.log('Before insert of create user');
    const insertInfo = await userCollection
        .insertOne(newUser)
        .catch(function (e) {
            throw 'Username already exists';
        });
    if (insertInfo.insertedCount === 0) throw `Could not add user`;
    return insertInfo.insertedId.toString();
}

async function getUser(emailId) {
    if (
        typeof emailId !== 'string' ||
        emailId.length === 0 ||
        emailId === ' '.repeat(emailId.length)
    )
        throw 'Error: emailId must be a non-empty string.';

    checkIsEmail(emailId);

    const userCollection = await users();
    const singleUserId = await userCollection.findOne({ email: emailId });
    if (singleUserId === null) throw 'Id not found';
    console.log(singleUserId);
    return { ...singleUserId, _id: singleUserId._id.toString() };
}

async function updateUser(
    firstName,
    lastName,
    email,
    oldEmail,
    phoneNumber,
    username,
    oldUsername,
    password,
    address,
    city,
    state,
    zip
) {
    if (!firstName) throw 'Must provide the first name';
    if (!lastName) throw 'Must provide the last name';
    if (!email) throw 'Must provide the email';
    if (!username) throw 'Must provide the username';

    if (!password) throw 'Must provide the password';

    if (!phoneNumber) throw 'Must provide the phone number';
    if (!address) throw 'Must provide the address';
    if (!city) throw 'Must provide the city';
    if (!state) throw 'Must provide the state';
    if (!zip) throw 'Must provide the zip';

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.toLowerCase().trim();
    username = username.toLowerCase().trim();
    password = password.trim();
    phoneNumber = phoneNumber.trim();
    address = address.trim();
    city = city.trim();
    state = state.trim();
    zip = zip.trim();

    try {
        checkIsString(firstName);
        checkIsString(lastName);
        checkIsString(email);
        checkIsString(username);
        checkIsString(password);

        checkIsString(address);
        checkIsString(city);
        checkIsString(state);
        checkIsString(zip);
        checkZip(zip);

        checkIsName(firstName);
        checkIsName(lastName);

        checkIsEmail(email);

        checkPhoneNumber(phoneNumber);
        checkIsUsername(username);
        checkIsPassword(password);
    } catch (e) {
        throw String(e);
    }

    const userCollection = await users();

    if (oldEmail !== email) {
        // check if email exists
        if (await userCollection.findOne({ email: email }))
            throw 'Email address is taken.';
    }

    if (oldUsername !== username) {
        // check if username exists
        if (await userCollection.findOne({ username: username }))
            throw 'Username is taken.';
    }

    found = false;

    for (let i = 0; i < stateList.length; i++) {
        if (state == stateList[i]) found = true;
    }

    if (found == false) {
        throw `State not found`;
    }

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        username: username,
        password: hash,
        address: address,
        city: city,
        state: state,
        zip: zip,
        bookRenting: [],
        purchasedBooks: [],
        reviews: [],
        // image: image,
    };

    const insertInfo = await userCollection
        .insertOne(newUser)
        .catch(function (e) {
            throw 'Username already exists';
        });
    if (insertInfo.insertedCount === 0) throw `Could not add user`;

    return insertInfo.insertedId.toString();
}

async function getUser(emailId) {
    if (
        typeof emailId !== 'string' ||
        emailId.length === 0 ||
        emailId === ' '.repeat(emailId.length)
    )
        throw 'Error: emailId must be a non-empty string.';

    checkIsEmail(emailId);
    const userCollection = await users();
    const singleUserId = await userCollection.findOne({ email: emailId });
    if (singleUserId === null) return null;
    return { ...singleUserId, _id: singleUserId._id.toString() };
}

async function updateUser(
    firstName,
    lastName,
    email,
    oldEmail,
    phoneNumber,
    username,
    oldUsername,
    password,
    address,
    city,
    state,
    zip
) {
    if (!firstName) throw 'Must provide the first name';
    if (!lastName) throw 'Must provide the last name';
    if (!email) throw 'Must provide the email';
    if (!username) throw 'Must provide the username';

    if (!password) throw 'Must provide the password';

    if (!phoneNumber) throw 'Must provide the phone number';
    if (!address) throw 'Must provide the address';
    if (!city) throw 'Must provide the city';
    if (!state) throw 'Must provide the state';
    if (!zip) throw 'Must provide the zip';

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.toLowerCase().trim();
    username = username.toLowerCase().trim();
    password = password.trim();
    phoneNumber = phoneNumber.trim();
    address = address.trim();
    city = city.trim();
    state = state.trim();
    zip = zip.trim();

    try {
        checkIsString(firstName);
        checkIsString(lastName);
        checkIsString(email);
        checkIsString(username);
        checkIsString(password);

        checkIsString(address);
        checkIsString(city);
        checkIsString(state);
        checkIsString(zip);
        checkZip(zip);

        checkIsName(firstName);
        checkIsName(lastName);

        checkIsEmail(email);

        checkPhoneNumber(phoneNumber);
        checkIsUsername(username);
        checkIsPassword(password);
    } catch (e) {
        throw String(e);
    }

    const userCollection = await users();

    if (oldEmail !== email) {
        // check if email exists
        if (await userCollection.findOne({ email: email }))
            throw 'Email address is taken.';
    }

    if (oldUsername !== username) {
        // check if username exists
        if (await userCollection.findOne({ username: username }))
            throw 'Username is taken.';
    }

    found = false;

    for (let i = 0; i < stateList.length; i++) {
        if (state == stateList[i]) found = true;
    }

    if (found == false) {
        throw `State not found`;
    }

    const hash = await bcrypt.hash(password, saltRounds);

    let updatedUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        username: username,
        password: hash,
        address: address,
        city: city,
        state: state,
        zip: zip,
    };

    const updateUser = await userCollection.updateOne(
        { email: oldEmail },
        { $set: updatedUser }
    );

    if (updateUser.modifiedCount === 0) throw 'User could not be updated';
    return updateUser;
}

// async function deleteUser(userId) {
//   // validateID(userId);
//   userId = userId.trim();
//   let result = {};
//   userId = ObjectId(userId);

//   const userCollection = await users();

//   const checkUser = await this.getUser(userId.toString());
//   if (!checkUser) throw "User info does not exists ";

//   const deleteUser = await userCollection.deleteOne({ _id: userId });
//   if (deleteUser.deletedCount == 0) {
//     throw "Could not delete the User";
//   } else {
//     result.userId = checkUser._id;
//     result.deleted = true;
//   }
//   return result;
// }

async function checkUser(username, password) {
    // error check
    if (!username) throw 'You must provide a username';
    if (!password) throw 'You must provide a password';

    username = username.toLowerCase().trim();

    try {
        checkIsString(username);
        checkIsString(password);
        checkIsUsername(username);
        checkIsPassword(password);
    } catch (e) {
        throw String(e);
    }

    // get user by username or email
    const userCollection = await users();
    let user = await userCollection.findOne({ username: username });

    // authenticate user
    if (!user || !bcrypt.compareSync(password, user.password))
        return { authenticated: false };

    return {
        authenticated: true,
        userId: user._id,
        username: username,
    };
}
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        date.getFullYear(),
    ].join('-');
}

async function getRentedBooks(userEmail) {
    const userCollection = await users();
    let user = await getUser(userEmail);
    if (user === null) throw `No user with that id.`;
    let rentedBooks = user.bookRenting;
    let rentedBooksCollection = [];
    let todayDate = formatDate(new Date());
    for (let book of rentedBooks) {
        if (book.endDate >= todayDate) {
            let id = book['_id'].toString();
            const bookDetail = await booksFunctions.getById(id);
            bookDetail['startDate'] = book.startDate;
            bookDetail['endDate'] = book.endDate;
            rentedBooksCollection.push(bookDetail);
        }
    }
    console.log(rentedBooksCollection);
    return rentedBooksCollection;
}

async function myOrders(emailId) {
    let myOrdersArr = [];
    let bookFound;
    const userCollection = await users();
    const booksCollection = await books();

    let user = await userCollection.findOne({ email: emailId });
    if (user === null) throw 'No users present with given Email Id';

    const d = await Promise.all(
        user.purchasedBooks.map(async (element) => {
            bookFound = {};
            bookFound = await booksCollection.findOne({
                _id: element._id,
            });
            if (bookFound === null) {
                throw `No book found with the id ${element._id}`;
            }
            bookFound.dateOfPurchase = element.dateOfPurchase;
            bookFound.totalPrice = element.totalPrice;
            bookFound.quantity = element.quantity;
            return bookFound;
        })
    );
    myOrdersArr = d;
    return myOrdersArr;
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    checkUser,
    myOrders,
    getRentedBooks,
};

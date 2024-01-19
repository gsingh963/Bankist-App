 'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    
    <div class="movements__value">${mov}</div>
    </div>
`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};
// console.log(calcDisplayBalance(account1.movements));

const calcDisplaySummary = function (acc) {
  // here we are doing the chaining
  const totalDeposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  console.log(totalDeposit);
  labelSumIn.textContent = `${totalDeposit}💶`;

  const totalWithdraw = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  console.log(totalWithdraw);
  labelSumOut.textContent = `${Math.abs(totalWithdraw)}💶`;

  const totalInterest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100) // let's say we want that only interest should be count which is atleast 1% then we will use filter here in between
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  console.log('total interest : ' + totalInterest);
  labelSumInterest.textContent = `${totalInterest}💶`;
};
// so the recommendation is to not overuse the chaining method , try to do it in as less methods bcz if  there is any error come up in the code , it will difficult to find and that can decrease the perforamance of the code

// calcDisplaySummary(account1.movements);

const checkUsername = function (accs) {
  accs.forEach(function (account) {
    account.Username = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};
checkUsername(accounts);
// console.log(accounts);

const updateUi = function (acc) {
  // DISPLAY MOVEMENTS
  displayMovements(acc.movements);

  // DISPLAY BALANCE
  calcDisplayBalance(acc);

  // DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

// LOGIN INFO
// EVENT HANDLER
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting

  currentAccount = accounts.find(
    acc => acc.Username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin == Number(inputLoginPin.value)) {
    console.log('LOGIN');
  }

  // CLEAR INPUT FIELDS
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  // DISPLAY UI AND MESSAGE
  labelWelcome.textContent = `Welcome Back, ${
    currentAccount.owner.split(' ')[0]
  }`;
  containerApp.style.opacity = 100;
  // UPDATE THE UI
  updateUi(currentAccount);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const reqAmount = Number(inputLoanAmount.value);
  if (
    reqAmount > 0 &&
    currentAccount.movements.some(mov => mov >= reqAmount * 0.1)
  ) {
    currentAccount.movements.push(reqAmount);
    // update UI
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAct = accounts.find(
    acc => acc.Username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAct &&
    currentAccount.balance >= amount &&
    receiverAct?.Username !== currentAccount.Username
  ) {
    // DOING THE TRANSFER
    currentAccount.movements.push(-amount);
    receiverAct.movements.push(amount);

    // UPDATE THE UI
    updateUi(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.Username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.Username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// LECTURES

// // forEach method for map and set
// currencies.forEach(function (value, key, map) {
//   console.log(` ${key} : ${value}`);
// });

// // set
// const newCurrencies = new Set(['USD', 'EUR', 'CAD', 'USD']);
// console.log(newCurrencies);

// // set does not have any key , its just only have value , so we need to write the key in console bcz it will print the error
// newCurrencies.forEach(function (value, key, map) {
//   console.log(`${value} : ${value}`);
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],

//   ['GBP', 'Pound sterling'],
// ]);
// MAP METHOD - MAP IS BASICALLY HERE IS DIFFERENT WHAT WE HAVE USED BEFORE
// SO WITH MAP METHOD, WE CAN LOOP THE ARRAY , SO
// FOR LOOPING THE ARRAY , WE HAVE LOT OF WAYS TO DO THAT
//LIKE FOR OF LOOP, SIMPLE FOR LOOP, FOREACH LOOP,
// BUT MAP MTHOD WILL LOOP THE ARRAY AND CREATE A NEW ARRAY WHICH INCLUDES PERFORMING SOME FUNCTIONS
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurTousd = 1.1;
// const newMovUSd = movements.map(function (mov) {
//   return mov * eurTousd;
// we can also do use map method in arrow function so it will be just one statement and its more readable.
const newMovUSd = movements.map(mov => mov * eurTousd);
// });
console.log(movements);
console.log(newMovUSd);

// we can also print the index in map as we did in the past in for loop
const newMov = movements.map(function (mov, i, array) {
  return `${i + 1} : ${mov}`;
});

console.log(newMov);
// // old method of looping the array

// for (const [i, mov] of movements.entries()) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1} : You deposited ${mov}`);
//   } else console.log(`Movement ${i + 1} : You withdraw ${Math.abs(mov)}`);
// }

// // new method of looping the array
// // here forEach is a hihger order function and inside it, there is callback function , callback function is telling to forEach is to perform these intruction over every iteration
// console.log('--------------------forEach method ---------------');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1} : You deposited ${mov}`);
//   } else console.log(`Movement ${i + 1} : You withdraw ${Math.abs(mov)}`);
// });

/////////////////////////////////////////////////

// slice method in arrays
// as we used the spice method in strings , it will make a take out the elements and put it into an array
// as same we can use the splice method in arrays as well, it will take some elements and put it into an array
// slice method will not affect the original array , it will remain same
// const arr = ['a', 'b', 'c', 'd', 'e'];
// const newArr = arr.slice(1, 4);
// console.log(newArr);
// console.log(arr.slice(-1));
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -2));

// console.log(arr.slice());
// console.log([...arr]); // both these statements will print the same result like the new array with the same elements

// // SPLICE METHOD - IT IS SAME LIKE AS THE SLICE METHOD BUT IT WILL CHANGE THE ORIGINAL ARRAY

// // arr = ['a', 'b', 'c', 'd', 'e'];
// console.log('------------SLICE METHOD ------------------');
// console.log(arr);
// console.log(arr.splice(1, 2));
// console.log(arr);

// // It is basically used to remove the last element of the array
// console.log(arr.splice(-1));
// console.log(arr);

// const arr1 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr1);
// console.log(arr1.reverse());
// console.log(arr1); // reverse method is also change the original array

// const arr2 = ['a', 'b', 'c', 'd', 'e'];

// const letters = arr2.concat(arr1);
// console.log(letters);
// console.log([...arr2, ...arr1]);
// // both above statement print the same result
// // and both of it will not mutate the original array

// // JOIN METHOD -> AS WE ALREADY DISCUSSED IN STRINGS , IT IS THE SAME ONE

// console.log(letters.join(' - '));

// AT METHOD -> TO PRINT OUT THE ELEMENT OF AN ARRAY

// const arr = [23, 43, 65];
// console.log(arr[0]);
// console.log(arr.at(0));
// // both statement will work the same

// // old method to print out the last element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// // both of them was the old method

// // at  method
// console.log(arr.at(-1)); // it will print the same result

// // SO AT() METHOD ALSO WORKS ON STRINGS
// console.log('gurjeet'.at(0));
// console.log('gurjeet'.at(-1));

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:



1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]*/

const checkDogs = function (dogsJulia, dogsKate) {
  const copyDogsJulia = dogsJulia.slice(1, 3);
  console.log(copyDogsJulia);
  /// we can use splice method here as well which will remove the element from the original array
  const newArray = [...copyDogsJulia, ...dogsKate]; // here we can use the concat method to concat two arrays

  console.log(newArray);
  newArray.forEach(function (dogNum, i, array) {
    if (dogNum >= 3)
      console.log(
        `Dog Number ${i + 1} is an adult ,and is ${dogNum} years old`
      );
    else console.log(`Dog Number ${i + 1} is still a puppy`);
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// const username = 'Gurjeet Singh';

// **************** FILTER METHOD **********************
// FILTER METHOD BASICALLY FILTER OUT THE DATA BASED ON THE INSTRUCTION FROM THE ARRAY AND STORE ALL THAT DATA IN NEW ARRAY

const deposit = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposit);

const deposits = [];
for (const mov of movements) {
  if (mov > 0) deposits.push(mov);
}
console.log(deposits);
// both for loop and filter method is doing the same work but filter one is more convinient and we can also do chaining in that as well which is difficult in doing the for loop

// for withdraw
const withdraw = movements.filter(mov => mov < 0);
console.log(withdraw);
// i have done it in arrow function as well

// reduce method -> reduce method will loop all the array and  sum up all the elements in the arrays and gives one accumulated value which we can store in one variable . reduce method has two parameters , first is function and second is initial value of accumulator

const balance = movements.reduce(function (acc, cur, i, array) {
  console.log(`Iteration ${i} : ${acc}, ${cur}`);
  return acc + cur;
}, 0);
// 0 is the initial value of the accumulator
// acc is accumulator value which will sum up the current values
// In arrow function
const balance2 = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);
console.log(balance2); // both of it will give the same result
let sum = 0;
for (const mov of movements) sum += mov;
console.log(sum);
// for loop will also give us the same result

// TO FIND THE MAXIMUM VALUE IN ARRAY , WE CAN USE THE REDUCE METHOD
// SEE HOW I WILL DO IT

const maxValue = movements.reduce((acc, cur) => {
  if (acc > cur) return acc;
  else return cur;
}, movements[0]);

console.log(maxValue);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map(function (dogAge, i) {
//     if (dogAge <= 2) return 2 * dogAge;
//     else return 16 + dogAge * 4;
//   });
//   console.log(humanAge);

//   const fiterData = humanAge.filter(function (dogAge, i) {
//     return dogAge < 18;
//   });

//   // console.log(`filter data : ${DogInhumanAge}`);
//   console.log(fiterData);

//   // reduce -> now we need to find the average of the human Age with reduce method
//   const average = [2, 3, 4, 5, 6].reduce(function (acc, age, i, array) {
//     return acc + age / array.length; // we can also find average of two num or many no -> 2,3  => 2/2 + 2/3 => 2.5
//   }, 0);
//   console.log(average);
// };

// const dogsvalue = [5, 2, 4, 1, 15, 8, 3];
// console.log(calcAverageHumanAge(dogsvalue));

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]

const calcAverageHumanAge = function (ages) {
  const averages = ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(age => age >= 18)
    .reduce((acc, humanAge, i, arr) => acc + humanAge / arr.length, 0);
  console.log(averages);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// FIND METHOD -> FIND METHOD IS SAME LIKE AS FILTER METHOD BUT THERE TWO MAJOR DIFFERENCE IN THAT
// FIND METHOD RETURNS ONLY THE FIRST ELEMENTS BASED ON THE MATCHING THE CONDITION BUT FILTER WILL RETRUN A NEW ARRAY
// FIND METHOD WILL RETURN ONLY SINGLE ELEMENT ITSELF, it will not retrun a new array

const withdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(withdrawal);

// USUALLY , THE GOAL OF FIND METHOD IS BASICALLY TO FIND ONE ELEMENT ITSELF

// WE CAN TAKE THE EXAMPLE OF ACCOUNTS array in which we have four objects
const findName = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(findName);
let accountfor;
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') accountfor = acc;
}
console.log(accountfor);

// SOME -> SOME METHOD IN ARRAYS IS USED TO FIND WHETHER ANY ELEMENTS HAS A TRUE CONDITION OR NOT

console.log(movements);
console.log(movements.some(mov => mov > 0));

// EVERY -> EVERY METHOD IS USED TO RETURN TRUE IF EVERY ELEMENTS WILL PASS THE CONDITION
console.log(account4.movements.every(mov => mov > 0)); // so accounts4 have only positive movements then it will give us the true value

// one thing which we can also do is that  we can write the callback function outside then use it wherever we need it . we dont need to overwrite it again
const depositAmt = mov => mov > 0;
console.log(account4.movements.every(depositAmt));
console.log(account3.movements.every(depositAmt));
console.log(account2.movements.every(depositAmt));

// writing callback function outside the method will help to maintain the dry principle

// flat and flatmap

//flat method is used to create a new array with the sub-array elements concatenated
const arr = [[2, 3], [4, 5], [2, 5, 4], 7];
const newArr = arr.flat();
console.log(newArr);

const deepArr = [
  [2, 3, [4, 5]],
  [3, 2, [2, 2]],
  [1, [3, 5], 6],
];
const newdeepArr = deepArr.flat(2);
console.log(newdeepArr);

// flat
const totalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalBalance);

// flatMap is used where first we need to use map and then flat so, instead of doing that , we prefer to use flatMap here

const totalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalBalance2);

// SORT METHOD

// string
const names = ['jonas', 'naunihal', 'gurjeet', 'xandre', 'sukhman'];
console.log(names.sort()); // it will mutate the original array

// numbers
// const sortmov = movements.sort();

const sortmov = movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1; // switching orders
});
console.log(sortmov); // if we sort the numbers with array then, it will not work. We need a call back function for that

const sortmov2 = movements.sort((a, b) => {
  if (a < b) return 1;
  if (a > b) return -1; // switching orders
});

console.log(sortmov2);

// fill and empty arrays

console.log([1, 2, 3, 4, 5, 5]);
console.log(new Array(1, 2, 3, 4, 5, 6));

const x = new Array(7);
console.log(x);
// it will print 7 empty elements in array
// fill array will mutate the original array
// fill array -> fill array will fill the empty array with same element which we put it in paranthesis
// x.fill(1);
// x.fill(1, 3);
x.fill(1, 3, 5);

// in fill array , we can also tell that from which index we want to print the element
console.log(x);

const arrr = [1, 2, 3, 4, 5, 6, 7];
arrr.fill(23, 4, 6);
console.log(arrr);

// Array.from()
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
// Array.from() is also used to print the array by doing some function, it is same like map method

const z = Array.from({ length: 8 }, (_, i) => i + 1); // (_)
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(movementsUI.map(el => el.textContent));
});

// practice of array methods

// 1) we will calculate the total deposited of the bank amount
const bankDepositedAmt = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositedAmt);

// 2) now i want to knw how many deposited of atleast 1000
const deposited1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(deposited1000);

const deposited1000secnd = accounts
  .flatMap(acc => acc.movements)
  //   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
  // console.log(deposited1000secnd);
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(deposited1000secnd);

//  ++ prefix operator
// let a = 10;
// console.log(++a);
// console.log(a);

// 3 ) Now we will use the reduce method to put the deposits and withdrawals in objects

const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawal += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawal'] += cur;
      return sums;
    },
    { deposits: 0, withdrawal: 0 }
  );

console.log(sums);

// 4) now we will convert the strings into capitalized ones with some exception of words

const capitalized = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['and', 'or', 'is', 'a', 'the'];

  const titlescase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titlescase);
};
console.log(capitalized('is is a nice title'));

//////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dog = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

dog.forEach(dogs => (dogs.recFood = Math.trunc(dogs.weight ** 0.75 * 28)));
console.log(dog);

// 2) Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓

const dogsSarah = dog.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah dogs is eating too ${
    dogsSarah.curFood > dogsSarah.recFood ? 'much' : 'little'
  }`
);

// 3) Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

const ownersEatTooMuch = dog
  .filter(dogs => dogs.curFood > dogs.recFood)
  .flatMap(dogs => dogs.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dog
  .filter(dogs => dogs.curFood < dogs.recFood)
  .flatMap(dogs => dogs.owners);
console.log(ownersEatTooLittle);

// 4) Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little`);

// 5) Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
console.log(dog.some(dogs => dogs.curFood === dogs.recFood));

// 6) Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// current > (recommended * 0.90) && current < (recommended * 1.10)

const checkOkayFood = dogs =>
  dogs.curFood > dogs.recFood * 0.9 && dogs.curFood < dogs.recFood * 1.1;
console.log(dog.some(checkOkayFood));

// 7)  Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
console.log(dog.filter(checkOkayFood));

// 8)  Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

const dogsSorted = dog.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);

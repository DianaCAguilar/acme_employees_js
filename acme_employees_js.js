// let invert = (object) => {
//   let newObj = {};
//   for (let k in object) {
//     newObj[object[k]] = k;
//   }
//   return newObj;
// }

// const invert2 = (obj) => {
//   return Object.entries(obj).reduce((acc, entry) => {
//     acc[entry[1]] = entry[0];
//     return acc;
//   }, {});
// }

// invert2({x: 'foo', y: 3});
//-------------Acme Assignment----------------
const employees = [
  { id: 1, name: 'moe'},
  { id: 2, name: 'larry', managerId: 1},
  { id: 4, name: 'shep', managerId: 2},
  { id: 3, name: 'curly', managerId: 1},
  { id: 5, name: 'groucho', managerId: 3},
  { id: 6, name: 'harpo', managerId: 5},
  { id: 8, name: 'shep Jr.', managerId: 4},
  { id: 99, name: 'lucy', managerId: 1}
];

const spacer = (text)=> {
  if(!text){
    return console.log('');
  }
  const stars = new Array(5).fill('*').join('');
  console.log(`${stars} ${text} ${stars}`);
} //returns '***** hello world *****'

//-------------findEmployeeByName----------------

spacer('findEmployeeByName Moe')
// given a name and array of employees, return employee

//[pk] this works, but it's more complex than it needs to be! read up on Array.prototype.find
const findEmployeeByName = (name, arrOfEmployees) => {
  for (let i = 0; i < arrOfEmployees.length; i++) {
    let eleObj = arrOfEmployees[i];
    //[pk] here you're just checking whether ANY key on the employee object has _name_ as its value -- but presumably we only really care about the key ".name"!
    //[pk] could have just said "if(eleObj.name===name) return eleObj"
    for(let k in eleObj) {
      if (eleObj[k] === name) {
        return eleObj;
      }
    }
  }
}

console.log(findEmployeeByName('moe', employees));//{ id: 1, name: 'moe' }
spacer('')
//-------------findManagerFor----------------

spacer('findManagerFor Shep')
//given an employee and a list of employees, return the employee who is the manager

//findManager for takes in the value of the findEmployeeByName function, and the array of employees

//[pk] again, works, but same issues as above!
const findManagerFor = (employeeObj, arrOfEmployees) => {

  for (let i = 0; i < arrOfEmployees.length; i++) {
    let eleObj = arrOfEmployees[i];
    for(let k in eleObj) {
      if (employeeObj['managerId'] === eleObj['id']) {
        return eleObj;
      }
    }
  }
}
console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees));//{ id: 4, name: 'shep', managerId: 2 }
spacer('')
//-------------findCoworkersFor----------------

spacer('findCoworkersFor Larry')

//given an employee and a list of employees, return the employees who report to the same manager

//[pk] great use of .filter! 
const findCoworkersFor = (employeeObj, arrOfEmployees) => {
  return arrOfEmployees.filter(function(employee) {
    return employeeObj['managerId'] === employee['managerId'];
    //[pk] ideally you want one more condition here -- you want to ensure that employeeObj != employeee
  })
}
console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees));/*
[ { id: 3, name: 'curly', managerId: 1 },
  { id: 99, name: 'lucy', managerId: 1 } ]
*/

spacer('');
//-------------findManagementChain----------------

spacer('findManagementChain for moe')
//given an employee and a list of employees, return a management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager 

const findManagementChainForEmployee = (employeeObj, arrOfEmployees) => {
  let chainArr = [];

  if(employeeObj['name']) {
    //[pk] tip: you could just do "while(employeeObj.managerId)"
    while (employeeObj.managerId !== undefined) {
      chainArr.push(findManagerFor(employeeObj, arrOfEmployees));
      employeeObj = chainArr[chainArr.length -1];
    }
    
  }
  //[pk] very good! order of the array is backwards though
  return chainArr;
}

console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees));//[  ]
spacer('');

spacer('findManagementChain for shep Jr.')
console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees));/*
[ { id: 1, name: 'moe' },
  { id: 2, name: 'larry', managerId: 1 },
  { id: 4, name: 'shep', managerId: 2 }]
*/
spacer('');

//-------------generateManagementTree----------------

spacer('generateManagementTree');
//given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.

const generateManagementTree = (employeeList) => {
  //find the boss object, the one with no managerId, aka Moe
  let bossObj = employeeList.find((employee) => {
    return employee.managerId === undefined;
  });
  //[pk] a touch verbose: employeeList.find(emplyoyee => !employee.managerId)

  return setReports(bossObj, employeeList);
}


const setReports = (manager, employeeList) => {
  let reports = findReports(manager, employeeList);

  manager.reports = reports;
  //[pk] you have this pattern: 
  //[pk] b = a
  //[pk] c = b
  //[pk] why not just c = a and cut out b?

  for (let i = 0; i < manager.reports.length; i++) {
    let report = manager.reports[i];

    setReports(report, employeeList);
  }
  //[pk] this is good but one of many places where you use a full-on for loop when you could just use an array method -- here forEach would work and be a lot less verbose!
  return manager;
}

//[pk] noice helper func
const findReports = (managerObj, employeeList) => {
  //match each employee's manager id, with the manager id to get manager's reports
  return employeeList.filter((employee) => {
     return (managerObj.id === employee.managerId);
  });
}

// end of the "generateManagementTree" stuff



console.log(JSON.stringify(generateManagementTree(employees), null, 2));


/*
{
  "id": 1,
  "name": "moe",
  "reports": [
    {
      "id": 2,
      "name": "larry",
      "managerId": 1,
      "reports": [
        {
          "id": 4,
          "name": "shep",
          "managerId": 2,
          "reports": [
            {
              "id": 8,
              "name": "shep Jr.",
              "managerId": 4,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "name": "curly",
      "managerId": 1,
      "reports": [
        {
          "id": 5,
          "name": "groucho",
          "managerId": 3,
          "reports": [
            {
              "id": 6,
              "name": "harpo",
              "managerId": 5,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 99,
      "name": "lucy",
      "managerId": 1,
      "reports": []
    }
  ]
}
*/
// spacer('');
//-------------displayManagementTree----------------

spacer('displayManagementTree')

// //given a tree of employees, generate a display which displays the hierarchy

//[pk] good but you forgot the dashes -- a critical part! see solution.
const displayManagementTree = (mgmTree) => {
  let employee = mgmTree.name;
  let dashes = '';
  console.log(employee)

  let reports = mgmTree.reports;

  for (let i = 0; i < reports.length; i++) {
    let report = reports[i];

    displayManagementTree(report);
    //[pk] what's going on with these two lines below? they don't do anything
    dashes += '-';
    employee = report.name;
  }
}

displayManagementTree(generateManagementTree(employees));
/*
// moe
// -larry
// --shep
// ---shep Jr.
// -curly
// --groucho
// ---harpo
// -lucy
// */

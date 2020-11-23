module.exports = (app) => {
    app.get('/setupAdmin', (req, res) => {
        const userModel = require('../models/user');
        var pass = 'admin', hashPass = new userModel().generateHash(pass)
        var admin = {
            "member_id": "emp_01",
            "name": "Admin",
            "email": "admin@sia.com",
            "mobile": "9790933505",
            "designation": "Admin",
            "doj": "2020-11-23",
            "dob": "1996-07-12",
            "gender": "male",
            "address": "Demo Address",
            "password": hashPass,
            "confirmpass": pass,
            "admin": true
        }
        req.db.get('users').insert(admin, (e, docs) => {
            var date = new Date().toLocaleDateString();
            var work = true
            if (new Date().getDay() == 0 || new Date().getDay() == 6)
                work = false
            var dataObj = {
                employee: docs._id,
                date: date,
                work: work,
                active: false,
                time_in: null,
                time_out: null
            }
            db.get('timesheets').insert(dataObj)
            res.send({ message: 'Admin inserted successfully', data: docs })
        })
    })
    app.get('/setupUser', (req, res) => {
        const userModel = require('../models/user');
        var pass = 'user', hashPass = new userModel().generateHash(pass)
        var commonData = {
            "mobile": "7894561230",
            "designation": "Employee",
            "doj": "2020-11-23",
            "dob": "1996-07-12",
            "gender": "male",
            "address": "Demo Address",
            "password": hashPass,
            "confirmpass": pass,
            "admin": false
        }
        var emp1 = Object.assign({}, {
            "member_id": "emp_02",
            "name": "Emp 1",
            "email": "emp1@sia.com"
        }, commonData)
        var emp2 = Object.assign({}, {
            "member_id": "emp_03",
            "name": "Emp 2",
            "email": "emp2@sia.com"
        }, commonData)
        req.db.get('users').insert(emp1, (e, docs) => {
            req.db.get('users').insert(emp2, (e, docs2) => {
                var date = new Date().toLocaleDateString();
                var work = true
                if (new Date().getDay() == 0 || new Date().getDay() == 6) work = false
                var dataObj = {
                    employee: docs._id,
                    date: date,
                    work: work,
                    active: false,
                    time_in: null,
                    time_out: null
                }
                var dataObj2 = {
                    employee: docs2._id,
                    date: date,
                    work: work,
                    active: false,
                    time_in: null,
                    time_out: null
                }
                db.get('timesheets').insert(dataObj, {})
                db.get('timesheets').insert(dataObj2, {})
                var dataArr = []
                dataArr[0] = docs; dataArr[1] = docs2
                res.send({ message: 'Users inserted successfully', data: dataArr })
            })

        })
    })
}
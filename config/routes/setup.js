module.exports = (app) => {
    app.get('/setupAdmin', (req, res) => {
        const userModel = require('../models/user');
        var pass = 'admin', hashPass = new userModel().generateHash(pass)
        var admin = {
            name: 'Admin',
            email: 'admin@sia.com',
            admin: true,
            password: hashPass,
            confirm_password: pass
        }
        req.db.get('users').insert(admin, (e, docs) => {
            res.send({ message: 'Admin inserted successfully', data: docs })
        })
    })
    app.get('/setupUser', (req, res) => {
        const userModel = require('../models/user');
        var pass = 'user', hashPass = new userModel().generateHash(pass)
        var emp1 = { name: 'Emp 1', email: 'emp1@sia.com', admin: false, password: hashPass, confirm_password: pass }
        var emp2 = { name: 'Emp 2', email: 'emp2@sia.com', admin: false, password: hashPass, confirm_password: pass }
        req.db.get('users').insert(emp1, (e, docs) => {
            req.db.get('users').insert(emp2, (e, docs2) => {
                var dataArr = []
                dataArr[0] = docs; dataArr[1] = docs2
                res.send({ message: 'Users inserted successfully', data: dataArr })
            })

        })
    })
}
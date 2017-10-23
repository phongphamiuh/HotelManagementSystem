'use strict';

const Sequelize = require('sequelize');
const Customers = require('../../src/models/customers.js')
const routes = [];

/**
 * @action list
 * @method get
 * @return Customers[]
 */
routes.push({
    meta: {
        name: 'customerList',
        method: 'GET',
        paths: [
            '/customer'
        ],
        version: '1.0.0'
    },
    middleware: (req, res, next) => {
        Customers.findAll({
            order: [
                ['id', 'DESC']
            ],
            attributes: [
                ['id', 'uid'],
                'created_at',
                'first_name',
                'last_name',
                'phone',
                'mobile',
                'city',
                'user_id'
            ]
        }).then((data) => {
            res.json(data);
            return next();
        });
    }
});

/**
 * @action read
 * @method get
 * @param id
 * @return Customers
 */
routes.push({
    meta: {
        name: 'customerRead',
        method: 'GET',
        paths: [
            '/customer/:id'
        ],
        version: '1.0.0'
    },
    middleware: (req, res, next) => {
        Customers.findOne({
            where: {
                id: {
                    [Sequelize.Op.eq]: req.params.id
                }
            },
            attributes: [
                ['id', 'uid'],
                'created_at',
                'first_name',
                'last_name',
                'phone',
                'mobile',
                'city',
                'user_id'
            ],
            limit: 1,
            raw: true
        }).then((data) => {
            res.json(data);
            return next();
        });
    }
});

/**
 * @action create
 * @method post
 * @return Customers
 */
routes.push({
    meta: {
        name: 'customerCreate',
        method: 'POST',
        paths: [
            '/customer'
        ],
        version: '1.0.0'
    },
    middleware: (req, res, next) => {
        // object
        const form = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: (req.body.phone) ? req.body.phone : null,
            mobile: (req.body.mobile) ? req.body.mobile : null,
            city: req.body.city,
            country: req.body.country,
            email: (req.body.email) ? req.body.email : null,
            organization: (req.body.organization) ? req.body.organization : null,
            user_id: req.body.user_id
        };

        // create record
        Customers.create(form).then((data) => {
            res.json(data);
            return next();
        }).catch((err) => {
            if (err.name === 'SequelizeValidationError') {
                res.json({
                    message: err.message,
                    type: err.type,
                    path: err.path
                });
            } else {
                res.json(err);
            }

            return next();
        });
    }
});

/**
 * @action update
 * @method put
 * @param id
 * @return Customers
 */
routes.push({
    meta: {
        name: 'customerUpdate',
        method: 'PUT',
        paths: [
            '/customer/:id'
        ],
        version: '1.0.0'
    },
    middleware: (req, res, next) => {
        const id = req.params.id;
        // object
        const form = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: (req.body.phone) ? req.body.phone : null,
            mobile: (req.body.mobile) ? req.body.mobile : null,
            city: req.body.city,
            country: req.body.country,
            email: (req.body.email) ? req.body.email : null,
            organization: (req.body.organization) ? req.body.organization : null
        };

        // update record
        Customers.find({
            where: {
                id: {
                    [Sequelize.Op.eq]: req.params.id
                }
            }
        }).then(data => {
            return data.updateAttributes(form);
        }).then((data) => {
            res.json(data);
            return next();
        }).catch((err) => {
            if (err.name === 'SequelizeValidationError') {
                res.json({
                    message: err.message,
                    type: err.type,
                    path: err.path
                });
            } else {
                res.json(err);
            }

            return next();
        });
    }
});

module.exports = routes;
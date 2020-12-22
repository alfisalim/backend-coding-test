'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

function log_error(message) {
    return logger.error(message);
};

module.exports = (db) => {
    app.get('/health', (req, res) => {
        res.status(200).json({
            code: 1, message: "ok", data: null
        });
        logger.info("Successfully");
    });

    app.post('/rides', jsonParser, async (req, res) => {
        var lastID;
        const {start_lat, start_long, end_lat, end_long, rider_name,driver_name, driver_vehicle} = req.body;

        if (Number(start_lat) < -75 || Number(start_lat) > 75 || Number(start_long) < -195 || Number(start_long) > 195) {
            var message = "Start latitude and longitude must be between -75 to 75 and -195 to 195 degrees respectively";
            log_error(message);
            return res.status(400).json({
                code: 0,
                message: message,
                data: null
            });
        }

        if (Number(end_lat) < -75 || Number(end_lat) > 75 || Number(end_long) < -195 || Number(end_long) > 195) {
            var message = 'End latitude and longitude must be between -75 to 75 and -195 to 195 degrees respectively';
            log_error(message);
            return res.status(400).json({
                code: 0,
                message: message,
                data: null
            });
        }

        if (typeof rider_name !== 'string' || rider_name.length < 1) {
            var message = 'Rider name must be a non empty string';
            log_error(message);
            return res.status(400).json({
                code: 0,
                message: message,
                data: null
            });
        }

        if (typeof driver_name !== 'string' || driver_name.length < 1) {
            var message = 'driver name must be a non empty string';
            log_error(message);
            return res.status(400).json({
                code: 0,
                message: message,
                data: null
            });
        }

        if (typeof driver_vehicle !== 'string' || driver_vehicle.length < 1) {
            var message = 'driver vehicle must be a non empty string';
            log_error(message);
            return res.status(400).json({
                code: 0,
                message: message,
                data: null
            });
        }

        const values = [start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle];
        const query = `INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const result = await db.run(query, values, function (err, rows) {
            if (err) {
                var message = 'Unknown error';
                log_error(message);
                return res.status(400).json({
                    code: 0,
                    message: message,
                    data: null
                });
            }
        });

        const show = await db.all('SELECT * FROM Rides ORDER BY rideID DESC LIMIT 1', function (err, rows) {
            if (err) {
                var message = 'Unknown error';
                log_error(message);
                return res.status(400).json({
                    code: 0,
                    message: message,
                    data: null
                });
            }

            res.send(rows);
            logger.info("Successfully");
        });

    });

    app.get('/rides', async (req, res) => {
        var numRows;
        var numPages;
        var queryPagination;
        var idParam;
        var values;
        var query;

        var numPerPage = 5;
        var page = parseInt(req.query.page, 10) || 0;
        var skip = page * numPerPage;
        var id = parseInt(req.query.id) || null;

        // Here we compute the LIMIT parameter for MySQL query
        var limit = skip + ' , ' + numPerPage;

        var query = "SELECT * FROM Rides WHERE 1 = 1";

        if (id != null) {
            query += " AND rideID = ? ";
            values = id;
        } else {
            query += " ORDER BY rideID DESC LIMIT " + limit;
        }

        const count = await db.all('SELECT COUNT(*) AS numRows FROM Rides', function (err, rows) {
            if (err) {
                var message = 'Unknown error';
                log_error(message);
                return res.status(400).json({
                    code: 0,
                    message: message,
                    data: null
                });
            }

            if (rows.length === 0) {
                var message = 'Could not find any rides';
                log_error(message);
                return res.status(400).json({
                    code: 0,
                    message: message,
                    data: null
                });
            }

            numRows = rows[0].numRows;
            numPages = Math.ceil(numRows / numPerPage);
        });

        const result = await db.all(query, values, function (err, rows) {
            var responsePayload = {
                results: rows
            };
            
            if (page < numPages) {
                responsePayload.pagination = {
                    currentPage: page,
                    perPage: numPerPage,
                };
            }
            else responsePayload.pagination = {
                err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
            };

            res.send(responsePayload);
            logger.info("Successfully");
        });
    });

    return app;
};

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

module.exports = (db) => {
    app.get('/health', (req, res) => {
        res.status(200).json({
            code: 1, message: "ok", data: null
        });
        logger.info("Successfully");
    });

    app.post('/rides', jsonParser, (req, res) => {
        const {start_lat, start_long, end_lat, end_long, rider_name,driver_name, driver_vehicle} = req.body;

        if (Number(start_lat) < -75 || Number(start_lat) > 75 || Number(start_long) < -195 || Number(start_long) > 195) {
            return res.status(400).json({
                code: 0,
                message: 'Start latitude and longitude must be between -75 to 75 and -195 to 195 degrees respectively',
                data: null
            });
            logger.error("Start latitude and longitude must be between -75 to 75 and -195 to 195 degrees respectively");
        }

        if (Number(end_lat) < -75 || Number(end_lat) > 75 || Number(end_long) < -195 || Number(end_long) > 195) {
            return res.status(400).json({
                code: 0,
                message: 'End latitude and longitude must be between -75 to 75 and -195 to 195 degrees respectively',
                data: null
            });
            logger.error("End latitude and longitude must be between -75 to 75 and -195 to 195 degrees respectively");
        }

        if (typeof rider_name !== 'string' || rider_name.length < 1) {
            return res.status(400).json({
                code: 0,
                message: 'Rider name must be a non empty string',
                data: null
            });
            logger.error("Rider name must be a non empty string");
        }

        if (typeof driver_name !== 'string' || driver_name.length < 1) {
            return res.status(400).json({
                code: 0,
                message: 'driver name must be a non empty string',
                data: null
            });
            logger.error("driver name must be a non empty string");
        }

        if (typeof driver_vehicle !== 'string' || driver_vehicle.length < 1) {
            return res.status(400).json({
                code: 0,
                message: 'driver vehicle must be a non empty string',
                data: null
            });
            logger.error("driver vehicle must be a non empty string");
        }

        const values = [start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle];
        const query = `INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const result = db.run(query, values, function (err) {
            if (err) {
                return res.status(400).json({
                    code: 0,
                    message: 'Unknown error',
                    data: null
                });
                logger.error("Something error");
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    return res.status(400).json({
                        code: 0,
                        message: 'Unknown error',
                        data: null
                    });
                    logger.error("Something error");
                }

                res.send(rows);
                logger.info("Successfully");
            });
        });
    });

    app.get('/rides', (req, res) => {
        db.all('SELECT * FROM Rides', function (err, rows) {
            if (err) {
                return res.status(400).json({
                    code: 0,
                    message: 'Unknown error',
                    data: null
                });
                logger.error("Something error");
            }

            if (rows.length === 0) {
                return res.status(400).json({
                    code: 0,
                    message: 'Could not find any rides',
                    data: null
                });
                logger.error("Something error");
            }

            res.send(rows);
            logger.info("Successfully");
        });
    });

    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
            if (err) {
                return res.status(400).json({
                    code: 0,
                    message: 'Unknown error',
                    data: null
                });
                logger.error("Something error");
            }

            if (rows.length === 0) {
                return res.status(400).json({
                    code: 0,
                    message: 'Could not find any rides',
                    data: null
                });
                logger.error("Something error");
            }

            res.send(rows);
            logger.info("Successfully");
        });
    });

    return app;
};

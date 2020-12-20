'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
                logger.error("Something error");
            }

            buildSchemas(db);

            done();
            logger.info("Successfully");
        });
    });

    describe('GET /', () => {

        it('should return ok', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});
describe('User Spec', function() {
  'use strict';

  const helper = require('./helper');
  const baseUrl = 'http://localhost:3000/api/';
  const request = require('supertest');
  const app = require('../index');

  beforeEach(function(done) {
    // Empty the DB then fill in some dummy data
    this.usersRoute = baseUrl + 'users';
    helper.clearDb(function() {
      helper.seedRoles(function() {
        helper.seedUsers(done);
      });
    });
  });

  describe('User Creation', function() {
    it('should create a user successfully', function(done) {
      request(app)
        .post('/api/users')
        .send({
          username: 'johnSnow',
          firstname: 'John',
          lastname: 'Snow',
          email: 'snow@winterfell.org',
          password: 'knfenfenfen',
          role: 'viewer'
        })
        .set('Accept', 'application/json')
        .expect(201)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.statusCode).toBe(201);
          expect(res.body.username).toBe('johnSnow');
          expect(res.body.name.first).toBe(
            'John');
          expect(res.body.name.last).toBe(
            'Snow');
          expect(res.body.id).not.toBeNull();
          done();
        });
    });

    it('should not create a duplicate user', function(done) {
      // Try to create a duplicate user
      request(app)
        .post('/api/users')
        .send({
          username: 'jsnow',
          firstname: 'John',
          lastname: 'Snow',
          email: 'snow@winterfell.org',
          password: 'knfenfenfen',
          role: 'viewer'
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toBe(
            'The User already exists');
          done();
        });
    });

    it('should populate the user\'s role if it is not defined',
      function(done) {
        request(app)
          .post('/api/users')
          .send({
            username: 'newUser',
            firstname: 'John',
            lastname: 'Snow',
            email: 'snow@winterfell.org',
            password: 'knfenfenfen',
          })
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.statusCode).toBe(201);
            expect(res.body.role).not.toBeNull();
            // The role should be a string data type
            expect(res.body.role).toEqual(jasmine.any(String));
            done();
          });
      });

  });

  describe('getAllUsers function', function() {

    it('should return all users when called', function(done) {
      // The 2 seeded Roles should be returned
      request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).toBeNull();
          expect(res.body.length).toBe(2);
          expect(res.body[0].username).toBe('jsnow');
          expect(res.body[1].username).toBe('nstark');
          done();
        });
    });
  });

});
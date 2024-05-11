# Voosh

## Introduction

This project is designed to Create users

## Installation

To install the project, run the following command: npm install

## Usage

To use the project,

## Project Structure

The project is structured as follows:

- `controllers/`: All the functionalities is implemented in controllers
- `database/`: The database structure is implemented here
- `routes/`: The api endpoints for the functionalities.
- `middlewares/`: The authentication part is implemented inside middlewares
- `app.js/`: app.js is the root file.

## Dependencies

The project depends on the following packages:

- `bcrypt`: Library for hashing passwords securely.
- `dotenv`: Library for loading environment variables from a .env file.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: Library for generating and verifying JSON Web Tokens (JWT).
- `mongodb`: Official MongoDB driver for Node.js.
- `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environentm.
- `aws-sdk`: For uploading photos. -`google-auth-library` : For using to login

## Configuration

.env file has all the configurations and the example you can found it in .env.example

## Configuration

.env file has all the configurations and the example you can found it in .env.example

## API Reference

### Endpoint: /user

#### POST /user/register

A new user can be created by sending a POST request to this endpoint with the following body:

```json
{
  "name": "",
  "password": "",
  "other": ""
}
```

#### POST /user/login

A registered user can login by passing the details in the body:

```json
{
  "email": "",
  "password": ""
}
```

#### POST /user/googleLogin

a google user can login using the tokenId. For testing purpose you can use tokenId provided by google playground

```json
{
  "token": ""
}
```

#### PUT /user/update

A user can update his/her details.

```json
{
  "body": ""
}
```

#### get /user/publicProfile/:id

Only admin can check all the profiles and normal users can only chech the profile whose isProfilePublic field is set to true

#### get /user/pgetPresignedUrl

This api generates preSigned url that are active for 6 minutes. Through that URL you can upload pictures in s3 bucket of AWS

### Incompleted part

1. I am not hosting this apis in any server. It can be easily deployed through cicd in aws cloud and can be updated easily
2. And I didnt use swagge as I am using postman. I have used swagger in my last organisatio. Not that familiar.
3. I could have used Joi validation for apis but it would make the project a bit longer.

## AUTHENTICATION

You need to provide x-api-key for the apis to run

## ENV

I have provide an env-example for your referance

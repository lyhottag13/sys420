import { PrismaClient } from '@prisma/client';

//Initializes Prisma Client for database operations.

const prisma = new PrismaClient();

/**
 * This asynchronous function handles HTTP requests for user management, supporting both
 * retrieval (GET) and creation (POST) of users. It leverages the Prisma Client for database operations.
 * 
 * GET requests must include `username` and `password` as query parameters to fetch user data.
 * POST requests accept user details in the request body to create a new user record.
 * 
 * @param {Object} req - The request object, containing query parameters or body data depending on the request method.
 * @param {Object} res - The response object used to send back HTTP responses.
 */
export default async function handler(req, res) {

  /**
   * Handles GET requests to fetch user data.
   * Requires username and password as query parameters.
   * Responds with user data if found, or appropriate error messages.
   * 
   * @param {string} req.query.username - The username of the user.
   * @param {string} req.query.password - The password of the user.
   */
  if (req.method === 'GET') {
    try{
      // Extract username and password from query parameters.
      const { username, password } = req.query;
      if( !username || !password ) return res.status(400).json({error: 'Required params were not given.'})

      const query = {
          where: {
            username,
            password
          }
      };

      // Attempt to find the user with provided credentials.
      let user = await prisma.user.findFirst(query);

      // If user is not found, return a 404 error.
      if(!user) return res.status(404).json({error: 'User not found'})
       // Return found user information.
      res.status(200).json(user)
    }
    catch (error){
      res.status(505).json({error: 'Fetching Error'});
    }
  }

   /**
   * Handles POST requests to create a new user.
   * Requires username, first name, last name, user type, and password in the request body.
   * Responds with the created user's data or appropriate error messages.
   * 
   * @param {string} req.body.username - The username for the new user.
   * @param {string} req.body.first_name - The first name of the new user.
   * @param {string} req.body.last_name - The last name of the new user.
   * @param {string} req.body.user_type - The type of the new user (e.g., admin and Operator).
   * @param {string} req.body.password - The password for the new user.
   */
  if (req.method === 'POST') {
    try{
      const { username, first_name, last_name, user_type, password } = req.body;

      const query = {
        data: {
          username,
          first_name,
          last_name,
          user_type,
          password
        },
      };

      // Create a new user in the database.
      const user = await prisma.user.create(query);
      
      res.status(200).json(user);
    }
    catch (error){
    // Log the error and return a generic server error message.

      // console.log(error);
      // res.status(505).json({error: 'User already exists.'});
      res.status(505).json({error});
    }
  }
}
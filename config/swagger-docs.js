/**
* @swagger
* /auth/facebook:
*    get:
*      tags:
*          - Facebook
*      summary: Retrieve facebook login
*      description: Link to facebook login
*      responses:
*        200:
*          description: Receive the callback link after facebook login.
*/

/**
* @swagger
* /auth/facebook/callback:
*    get:
*      tags:
*          - Facebook
*      summary: Callback after login
*      description: 
*      responses:
*        200:
*          description: Receive the callback link after facebook login.
*/

 /**
* @swagger
* /auth/google:
*    get:
*      tags:
*          - Google
*      summary: Retrieve google login
*      description: Link to google login
*      responses:
*       200:
*          description: Receive back the link to login with
*/

 /**
* @swagger
* /auth/google/callback:
*    get:
*      tags:
*          - Google
*      summary: Callback after google login
*      description: 
*      responses:
*        200:
*          description: Receive the callback link after google loggin
*/

 /**
* @swagger
* /home:
*    get:
*      tags:
*          - Home
*      summary: Retrieve all posts on home
*      description: Using this route will return all currently displayed posts on the homepage, be sure to use the json type header or you'll get a login screen.
*      responses:
*        200:
*          description: The JSON with all posts on the homepage
*/


/**
 * @swagger
 * /post/{postid}:
 *    get:
 *      tags:
 *          - Post
 *      summary: Retrieve the post information
 *      description: This is where you can ask for information on a post. If a post contains polls these will be send as well.
 *      consumes:
 *        - string
 *      parameters:
 *        - name: postid
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Receive back the post information with or without polls
 */

  /**
 * @swagger
 * /poll/{pollid}:
 *    get:
 *      tags:
 *          - Poll
 *      summary: Retrieve the poll information
 *      description: This is where you can ask for information on a poll. If a poll contains answers these will be send as well.
 *      consumes:
 *        - string
 *      parameters:
 *        - name: pollid
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Receive back the poll information with or without answers
 */

   /**
 * @swagger
 * /poll:
 *    get:
 *      tags:
 *          - Poll
 *      summary: Retrieve a poll with a query
 *      description: This is where you can ask for information on a poll with a query. If a poll contains answers these will be send as well.
 *      consumes:
 *        - string
 *      responses:
 *        200:
 *          description: Receive back the poll information with or without answers
 */

   /**
 * @swagger
 * /poll:
 *    post:
 *      tags:
 *          - Poll
 *      summary: Post a poll.
 *      description: This is where you can post a poll.
 *      parameters:
 *        - name: body
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              pollId: 
 *                type: string
 *              name: 
 *                type: string
 *              postId: 
 *                type: string
 *              answersAmount:
 *                type: integer     
 *      responses:
 *        200:
 *          description: Receive back the poll information with or without answers
 */

   /**
 * @swagger
 * /poll/{pollid}/answer/{answerid}:
 *    get:
 *      tags:
 *          - Poll
 *          - Answer
 *      summary: Retrieve an answer on a poll
 *      description: This is where you can ask for information on an answer.
 *      consumes:
 *        - string
 *      parameters:
 *        - name: pollid
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *        - name: answerid
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Receive back the answer
 */

    /**
 * @swagger
 * /poll/{pollid}/answer/{answerid}/votes:
 *    get:
 *      tags:
 *          - Poll
 *      summary: Retrieve the number of votes on a poll
 *      description: This is where you can ask for the amount of poll votes.
 *      consumes:
 *        - string
 *      parameters:
 *        - name: pollid
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *        - name: answerid
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Receive back the number of votes
 */

     /**
 * @swagger
 * /user/{userid}/poll/{pollid}/answer/{answerid}:
 *    get:
 *      tags:
 *          - Poll
 *      summary: Retrieve a specific answer of a poll
 *      description: With this route you can ask for specific answers depending on the userid, pollid and answerid
 *      consumes:
 *        - string
 *      parameters:
 *        - name: pollid
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *        - name: userid
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *        - name: answerid
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Receive back an answer of a poll
 */
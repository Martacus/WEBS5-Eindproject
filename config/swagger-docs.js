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
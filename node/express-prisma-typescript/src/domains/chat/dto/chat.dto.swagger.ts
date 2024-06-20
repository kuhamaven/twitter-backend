/**
 * @swagger
 * components:
 *   schemas:
 *     ConversationDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the conversation
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date and time of the conversation
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of user IDs who are members of the conversation
 *       required:
 *         - id
 *         - createdAt
 *         - members
 *       example:
 *         id: "123"
 *         createdAt: "2024-06-20T14:28:23.382Z"
 *         members:
 *           - "user1"
 *           - "user2"
 *     MessageDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date and time of the message
 *         author:
 *           type: string
 *           description: The ID of the author of the message
 *         conversation:
 *           type: string
 *           description: The ID of the conversation to which the message belongs
 *         content:
 *           type: string
 *           description: The content of the message
 *       required:
 *         - id
 *         - createdAt
 *         - author
 *         - conversation
 *         - content
 *       example:
 *         id: "456"
 *         createdAt: "2024-06-20T14:28:23.382Z"
 *         author: "user1"
 *         conversation: "123"
 *         content: "Hello, world!"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePostInputDTO:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           maxLength: 240
 *           description: Content of the post
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           maxLength: 4
 *           description: Array of image URLs
 *       example:
 *         content: "This is a sample post"
 *         images: ["image1.jpg", "image2.jpg"]
 *     PostDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the post
 *         authorId:
 *           type: string
 *           description: ID of the author
 *         content:
 *           type: string
 *           description: Content of the post
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date of the post
 *       example:
 *         id: "post123"
 *         authorId: "user456"
 *         content: "This is a sample post"
 *         images: ["image1.jpg", "image2.jpg"]
 *         createdAt: "2024-06-07T00:00:00.000Z"
 *     ExtendedPostDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/PostDTO'
 *       properties:
 *         author:
 *           $ref: '#/components/schemas/ExtendedUserDTO'
 *         qtyComments:
 *           type: integer
 *           description: Number of comments
 *         qtyLikes:
 *           type: integer
 *           description: Number of likes
 *         qtyRetweets:
 *           type: integer
 *           description: Number of retweets
 *       example:
 *         id: "post123"
 *         authorId: "user456"
 *         content: "This is a sample post"
 *         images: ["image1.jpg", "image2.jpg"]
 *         createdAt: "2024-06-07T00:00:00.000Z"
 *         author: { ... }
 *         qtyComments: 10
 *         qtyLikes: 20
 *         qtyRetweets: 5
 */

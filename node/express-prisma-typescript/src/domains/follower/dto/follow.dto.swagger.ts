/**
 * @swagger
 * components:
 *   schemas:
 *     FollowDTO:
 *       type: object
 *       required:
 *         - followerId
 *         - followedId
 *       properties:
 *         followerId:
 *           type: string
 *           description: ID of the user who is following
 *         followedId:
 *           type: string
 *           description: ID of the user being followed
 *       example:
 *         followerId: "user123"
 *         followedId: "user456"
 */

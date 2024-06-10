/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the user
 *         name:
 *           type: string
 *           nullable: true
 *           description: Name of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date of the user
 *       example:
 *         id: "user123"
 *         name: "John Doe"
 *         createdAt: "2024-06-07T00:00:00.000Z"
 *     ExtendedUserDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/UserDTO'
 *       properties:
 *         email:
 *           type: string
 *           description: Email of the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *       example:
 *         id: "user123"
 *         name: "John Doe"
 *         createdAt: "2024-06-07T00:00:00.000Z"
 *         email: "john.doe@example.com"
 *         username: "johndoe"
 *         password: "securepassword"
 *     UserViewDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the user
 *         name:
 *           type: string
 *           description: Name of the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: Profile picture URL of the user
 *       example:
 *         id: "user123"
 *         name: "John Doe"
 *         username: "johndoe"
 *         profilePicture: "http://example.com/profile.jpg"
 */

import
{
    register,
    login,
    refreshToken,
    logout,
    getUserDetails,
    deleteUser,
    getUserDetailsById,
    toggleFavorite,
} from '../controllers/Auth_Controller.js';
import User from '../models/Auth_Model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../models/Auth_Model.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockReqRes = () =>
{
    const req = {
        body: {},
        params: {},
        headers: {},
        user: { _id: 'mockUserId', role: 'user' },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
    };
    return { req, res };
};

test('register - should create a new user if not exists', async () =>
{
    const { req, res } = mockReqRes();
    req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        contactno: '12345',
    };

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(true) }));

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
});

test('login - should return tokens if credentials are valid', async () =>
{
    const { req, res } = mockReqRes();
    req.body = { email: 'john@example.com', password: '123456' };

    const mockUser = {
        _id: 'mockUserId',
        email: 'john@example.com',
        firstName: 'John',
        password: 'hashedPassword',
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        uid: mockUser._id,
        uemail: mockUser.email,
        uname: mockUser.firstName,
    });
});



test('getUserDetails - should return user details if found', async () =>
{
    const { req, res } = mockReqRes();
    const mockUserData = { _id: 'mockUserId', email: 'user@example.com' };

    User.findById.mockResolvedValue(mockUserData);
    await getUserDetails(req, res);

    expect(User.findById).toHaveBeenCalledWith('mockUserId');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ userdetails: mockUserData });
});

test('deleteUser - should delete user and return success', async () =>
{
    const { req, res } = mockReqRes();
    User.findByIdAndDelete.mockResolvedValue(true);

    await deleteUser(req, res);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith('mockUserId');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
});

test('toggleFavorite - should add or remove country from favorites', async () =>
{
    const { req, res } = mockReqRes();
    req.body = { countryCode: 'US' };

    const mockUser = {
        favorites: [],
        save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockResolvedValue(mockUser);

    await toggleFavorite(req, res);

    expect(mockUser.favorites).toContain('US');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        message: 'Favorites updated',
        favorites: ['US'],
    });
});

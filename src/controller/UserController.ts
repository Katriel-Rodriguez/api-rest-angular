import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from 'class-validator';

export class UserController {
    //Get all users
    static getAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        let users;

        try {
            users = await userRepository.find({ select: ["id", "username", "role"] });
        } catch (e) {
            res.status(404).json({ message: 'Something goes wron!' });
        }

        if (users.length > 0) {
            res.send(users);
        }
        else {
            res.status(400).json({ message: 'Not result' });
        }
    }

    //Get one user
    static getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOneOrFail(id, { select: ["id", "username", "role"] });
            res.send(user);
        } catch (e) {
            res.status(400).json({ message: 'Not result' });
        }
    }

    //Create a new ser
    static newUser = async (req: Request, res: Response) => {
        const { username, password, role } = req.body;
        const user = new User();

        user.username = username;
        user.password = password;
        user.role = role;

        //validate
        const errors = await validate(user, { validationError: { target: false, value: false } });
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const userRepository = getRepository(User);
        try {
            user.hasPassword();
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).json({ message: 'Username already exist' });
        }

        res.status(201).json({ message: 'User created' });
    }

    //Update user
    static editUser = async (req: Request, res: Response) => {
        let user;
        const { id } = req.params;
        const { username, role } = req.body;
        const userRepository = getRepository(User);

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username;
        user.role = role;

        //validate
        const errors = await validate(user, { validationError: { target: false, value: false } });
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).json({ message: 'Username already in use' });
        }

        res.status(201).json({ message: 'User updated' });
    }

    //Delete user
    static deleteUser = async (req: Request, res: Response) => {
        let user;
        const { id } = req.params;
        const userRepository = getRepository(User);

        try {
            user = await userRepository.findOneOrFail(id, { select: ["id", "username", "role"] });
        } catch (e) {
            return res.status(404).json({ message: 'User not found' });
        }

        userRepository.delete(id);

        res.status(201).json({ message: 'User deleted' });
    }
}

export default UserController;
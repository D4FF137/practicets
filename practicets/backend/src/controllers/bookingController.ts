import { Request, Response } from 'express';
import Booking, { IBooking } from "../models/Booking";
import User from "../models/User";
import Nomer from "../models/Nomer";
import { z } from 'zod';

const bookingValidationSchema = z.object({
    user: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    nomer: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid nomer ID'),
});

export default class BookingController {
    static async create(req: Request, res: Response) {
        try {
            const validatedData = bookingValidationSchema.parse(req.body);

            const user = await User.findById(validatedData.user);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const nomer = await Nomer.findById(validatedData.nomer);
            if (!nomer) {
                return res.status(404).json({ error: 'Nomer not found' });
            }

            const hostesses = await User.find({ roleID: 2 });
            if (hostesses.length === 0) {
                return res.status(404).json({ error: 'No hostesses available' });
            }

            const randomHostess = hostesses[Math.floor(Math.random() * hostesses.length)];

            const booking = new Booking({
                user: validatedData.user,
                nomer: validatedData.nomer,
                hostess: randomHostess._id,
            });

            const savedBooking = await booking.save();

            return res.status(201).json({ msg: 'Booking created', booking: savedBooking });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async readAll(req: Request, res: Response) {
        try {
            const bookings = await Booking.find().populate('user').populate('nomer').populate('hostess');
            return res.status(200).json(bookings);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async readOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const booking = await Booking.findById(id).populate('user').populate('nomer').populate('hostess');

            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            return res.status(200).json(booking);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const booking = await Booking.findById(id);
            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            booking.status = status;
            const updatedBooking = await booking.save();

            return res.status(200).json({ msg: 'Booking updated', booking: updatedBooking });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedBooking = await Booking.findByIdAndDelete(id);

            if (!deletedBooking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            return res.status(200).json({ msg: 'Booking deleted', booking: deletedBooking });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Booking_1 = __importDefault(require("../models/Booking"));
const User_1 = __importDefault(require("../models/User"));
const Nomer_1 = __importDefault(require("../models/Nomer"));
const zod_1 = require("zod");
const bookingValidationSchema = zod_1.z.object({
    user: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    nomer: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid nomer ID'),
});
class BookingController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = bookingValidationSchema.parse(req.body);
                const user = yield User_1.default.findById(validatedData.user);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                const nomer = yield Nomer_1.default.findById(validatedData.nomer);
                if (!nomer) {
                    return res.status(404).json({ error: 'Nomer not found' });
                }
                const hostesses = yield User_1.default.find({ roleID: 2 });
                if (hostesses.length === 0) {
                    return res.status(404).json({ error: 'No hostesses available' });
                }
                const randomHostess = hostesses[Math.floor(Math.random() * hostesses.length)];
                const booking = new Booking_1.default({
                    user: validatedData.user,
                    nomer: validatedData.nomer,
                    hostess: randomHostess._id,
                });
                const savedBooking = yield booking.save();
                return res.status(201).json({ msg: 'Booking created', booking: savedBooking });
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    return res.status(400).json({ errors: error.errors });
                }
                console.error(error);
                return res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static readAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield Booking_1.default.find().populate('user').populate('nomer').populate('hostess');
                return res.status(200).json(bookings);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static readOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const booking = yield Booking_1.default.findById(id).populate('user').populate('nomer').populate('hostess');
                if (!booking) {
                    return res.status(404).json({ error: 'Booking not found' });
                }
                return res.status(200).json(booking);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const booking = yield Booking_1.default.findById(id);
                if (!booking) {
                    return res.status(404).json({ error: 'Booking not found' });
                }
                booking.status = status;
                const updatedBooking = yield booking.save();
                return res.status(200).json({ msg: 'Booking updated', booking: updatedBooking });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deletedBooking = yield Booking_1.default.findByIdAndDelete(id);
                if (!deletedBooking) {
                    return res.status(404).json({ error: 'Booking not found' });
                }
                return res.status(200).json({ msg: 'Booking deleted', booking: deletedBooking });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Server error' });
            }
        });
    }
}
exports.default = BookingController;

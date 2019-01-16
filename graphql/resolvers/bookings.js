const Booking = require('../../models/booking')
const Event = require('../../models/event')
const { transformEvent, transformBooking } = require('./helpers')

module.exports = {
    bookings: async (ctx) => {
      if (!ctx.isAuth) {
        throw new Error('You must be logged in to book an event!')
      }
      try {
        const bookings = await Booking.find();
        return bookings.map(booking => {
          return transformBooking(booking);
        })
      } catch (err) {
        throw err;
      }
    },
    bookEvent: async (args, ctx) => {
      if (!ctx.isAuth) {
        throw new Error('You must be logged in to book an event!')
      }
      try {
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
          user: ctx.userId,
          event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
      } catch (err) {
        throw err;
      }
    },
    cancelBooking: async (args, ctx) => {
      if (!ctx.isAuth) {
        throw new Error('You must be logged in!')
      }
      try {
        const booking = await Booking.findById(args.bookingId).populate('event');
        const event = transformEvent(booking.event);
        await Booking.deleteOne({ _id: args.bookingId });
        return event;
      } catch (err) {
        throw err;
      }
    }
};

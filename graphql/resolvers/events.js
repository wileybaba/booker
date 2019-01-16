const Event = require('../../models/event');
const User = require('../../models/event');
const { transformEvent } = require('./helpers')


module.exports = {
    events: async () => {
      try {
        const events = await Event.find()
            return events.map(event => {
              return transformEvent(event);
            });
      } catch (err) {
        throw err;
      }
    },
    createEvent: async (args, ctx) => {
      if (!ctx.isAuth) {
        throw new Error('You must be authenticated to create an event!')
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: ctx.userId
      });
      let createdEvent;
      try {
        const result = await event.save()
        createdEvent = transformEvent(result);
        const creator = await User.findById('5c34631b2b27f56aa2edd14f')
        if (!creator) {
          throw new Error('User not found.')
        }
        creator.createdEvents.push(event);
        await creator.save();
        return createdEvent;
      } catch (err) {
        throw err;
      }
    }
};

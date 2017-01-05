export default function(state = { events: [], futureEvents: [] }, action) {
  switch(action.type) {
    case 'GET_EVENTS':
    console.log('THIS IS THE GET EVENTS REDUCER: ', action.payload);
      let events = action.payload.data.length === 0 ? [] : action.payload.data;
      let currentDate = new Date();
      let sortedEvents = events.sort((a, b) => {
        let aDate = new Date(a.date.slice(0,10));
        let bDate = new Date(b.date.slice(0,10));
        return aDate - bDate;
      })
      let futureEvents = sortedEvents.filter((event) => {
        let eventDate = new Date(event.date.slice(0,10));
        return eventDate > currentDate;
      });
      return {
        events,
        futureEvents,
      }
    case 'REMOVE_EVENT':

        futureEvents = [...state.futureEvents.slice(0, action.i), ...state.futureEvents.slice(action.i + 1)];
        console.log('FUTURE EVENTS 2', futureEvents)
        return {
          futureEvents,
        }
    default:
      return state;
  }
}

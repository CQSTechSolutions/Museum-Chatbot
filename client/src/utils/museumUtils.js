import museumData from '../data/museumData.json';

export const getTicketPrices = () => {
  return museumData.booking.ticketTypes;
};

export const getGuidedTours = () => {
  return museumData.booking.guidedTours;
};

export const getSpecialExhibits = () => {
  return museumData.booking.specialExhibits;
};

export const getMuseumInfo = () => {
  return museumData.museum;
};

export const getMembershipOptions = () => {
  return museumData.membership.levels;
};

export const getCurrentExhibits = () => {
  return {
    permanent: museumData.exhibits.permanent,
    interactive: museumData.exhibits.interactive
  };
};

export const getFacilities = () => {
  return museumData.facilities;
}; 
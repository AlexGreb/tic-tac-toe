export const createMessage = (type, payload) => {
  return {
    type,
    payload: {
      ...payload,
    },
  };
};

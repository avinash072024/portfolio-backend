let ioInstance = null;

const setIo = (io) => {
  ioInstance = io;
};

const getIo = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO instance has not been initialized.');
  }
  return ioInstance;
};

const emit = (event, payload = {}) => {
  if (!ioInstance) return;
  ioInstance.emit(event, payload);
};

module.exports = {
  setIo,
  getIo,
  emit,
};

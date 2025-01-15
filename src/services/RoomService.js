import { apiCaller } from "../config/AxiosHelper";

export const createRoomAPI = async (roomDetail) => {
  const response = await apiCaller.post(`/api/v1/rooms/${roomDetail}`);
  return response.data;
};

export const joinRoomAPI = async (roomDetail) => {
  const response = await apiCaller.get(`/api/v1/rooms/${roomDetail}`);
  return response.data;
};

export const getMessages = async (roomId, size = 50, page = 0) => {
  const response = await apiCaller.get(
    `/api/v1/rooms/getmessages/${roomId}?size=${size}&page=${page}`
  );
  return response.data;
};

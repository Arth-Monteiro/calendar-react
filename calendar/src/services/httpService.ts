import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
});

export async function read(url: string): Promise<Object> {
  const { data } = await axiosInstance.get(url);
  return data;
}

export async function exclude(url: string) {
  await axiosInstance.delete(url);
}

export async function create(url: string, object: Object): Promise<Object> {
  const { data } = await axiosInstance.post(url, object);
  return data;
}

export async function edit(url: string, object: Object): Promise<Object> {
  const { data } = await axiosInstance.put(url, object);
  return data;
}

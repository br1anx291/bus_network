import PocketBase from 'pocketbase';

// Thay bằng URL thật bạn nhận được
const url = import.meta.env.VITE_POCKETBASE_URL;
const pb = new PocketBase(url);

// Tắt chế độ tự hủy request để tránh lỗi khi gọi nhiều API cùng lúc
pb.autoCancellation(false);

export default pb;
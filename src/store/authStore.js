// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Tạo store bằng Zustand.
 * Chúng ta dùng middleware `persist` để tự động lưu state vào localStorage.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      // --- STATE ---
      user: null,          // Thông tin người dùng (object)
      token: null,         // JWT Token (string)
      isAuthenticated: false, // Trạng thái đăng nhập (boolean)

      // --- ACTIONS ---

      /**
       * Action: Đăng nhập
       * Lưu user và token vào state
       */
      login: (userData, userToken) => {
        set({
          user: userData,
          token: userToken,
          isAuthenticated: true,
        });
        console.log('AuthStore: Đã đăng nhập', { userData, userToken });
      },

      /**
       * Action: Đăng xuất
       * Xóa user và token khỏi state
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        console.log('AuthStore: Đã đăng xuất');
      },
      
      /**
       * Action: Cập nhật thông tin user (ví dụ: sau khi edit profile)
       */
      updateUser: (updatedUserData) => {
        set((state) => ({
          ...state,
          user: {
            ...state.user,
            ...updatedUserData,
          },
        }));
      },

    }),
    {
      // Tên của key trong localStorage
      name: 'auth-storage', 
    }
  )
);
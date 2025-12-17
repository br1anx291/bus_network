import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,        
      isAuthenticated: false, 

      login: (userData, userToken) => {
        set({
          user: userData,
          token: userToken,
          isAuthenticated: true,
        });
        console.log('AuthStore: Đã đăng nhập', { userData, userToken });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        console.log('AuthStore: Đã đăng xuất');
      },

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
      name: 'auth-storage', 
    }
  )
);
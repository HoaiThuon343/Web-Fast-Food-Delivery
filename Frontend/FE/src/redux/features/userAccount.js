// import { createSlice } from "@reduxjs/toolkit";

// const initialValue = null;

// // const userAccount = createSlice({
// //   name: "account",
// //   initialState: initialValue,
// //   reducers: {
// //     login: (state, action) => action.payload,
// //     logout: (state, action) => initialValue,
// //   },
// // });


// const userAccountSlice = createSlice({
//     name: "accountmanage", 
//     initialState: initialValue,
//     reducers: {
//         loginSuccess: (state, action) => action.payload,  
//         logout: (state, action) => initialValue,
//     },
// });
// export const { loginSuccess, logout } = userAccountSlice.actions;

// export default userAccountSlice.reducer;

// userAccount.js
import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    isLoggedIn: false,
    id: null,
    fullName: null,
    role: null,
    email: null,
    status: null 
};

const userAccountSlice = createSlice({
    // DÙNG LẠI TÊN CŨ 'account' để khớp với cấu hình store.js ban đầu
    name: "account", 
    initialState: initialValue,
    reducers: {
        // Đổi tên thành 'login' để khớp với các file cũ khác
        login: (state, action) => { 
            state.isLoggedIn = true;
            state.id = action.payload.id;
            state.fullName = action.payload.fullName;
            state.role = action.payload.role;
            state.email = action.payload.email;
            state.status = action.payload.status;
        },
        logout: (state, action) => initialValue,
    },
});

// Export tên ACTION cũ
export const { login, logout } = userAccountSlice.actions; 
export default userAccountSlice.reducer;
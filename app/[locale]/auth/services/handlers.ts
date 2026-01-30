// import { createAsyncThunk } from "@reduxjs/toolkit"
// import { UserRole } from "@/lib/roles"
// import { createTutorProfile } from "@/lib/tutor-service"

// interface RegisterPayload {
//   name: string
//   email: string
//   password: string
//   role: UserRole
// }

// export const registerUser = createAsyncThunk(
//   "auth/register",
//   async (payload: RegisterPayload, { rejectWithValue }) => {
//     try {
//       const user = await signUpService(
//         payload.email,
//         payload.password,
//         payload.name,
//         payload.role
//       )

//       if (payload.role === UserRole.Tutor) {
//         await createTutorProfile(user.uid, {
//           displayName: payload.name,
//           email: payload.email,
//         })
//       }

//       return { role: payload.role }
//     } catch (error) {
//       return rejectWithValue("REGISTER_FAILED")
//     }
//   }
// )

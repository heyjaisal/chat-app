import { create } from "zustand";
import { createAuthslice } from "./slice/auth-slice";

export const useAppstore = create()((...a)=>({
  ...createAuthslice(...a),
}))

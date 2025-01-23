export const createAuthslice = (set) =>({
  userInfo:undefined,
  setUserinfo:(userInfo) => set({userInfo})
})
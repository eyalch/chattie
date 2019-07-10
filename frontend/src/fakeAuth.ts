const fakeRequest = () => new Promise(resolve => setTimeout(resolve, 500))

export const fakeAuth = {
  isAuthenticated: false,
  login() {
    this.isAuthenticated = true
    return fakeRequest()
  },
  logout() {
    this.isAuthenticated = false
    return fakeRequest()
  },
}

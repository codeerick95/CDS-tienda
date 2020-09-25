export default ({ app }) => {
    const client = app.apolloProvider.defaultClient
    const token = app.$apolloHelpers.getToken()

    if (token) {
        client.tokenName = token
    }
}
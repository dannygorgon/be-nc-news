const app = require("./app")
const { PORT = 9090 } = process.env;
app.listen(port, () => {
    console.log(`You are now connected on port ${port}`)
}) 
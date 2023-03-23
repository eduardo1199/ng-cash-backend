import { app } from './app'
import { env } from './env/validate'

app.listen({ port: env.PORT }, () => {
  console.log('server is running on port 3333')
})

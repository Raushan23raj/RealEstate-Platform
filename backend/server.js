import express from 'express'

const app = express();

app.get('/', (req,res)=>{
      res.send('server is ready at this time');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
      console.log(`server is running on http://localhost:${PORT}`)
})
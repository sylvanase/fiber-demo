import express from 'express'

const app = express()

// dist作为静态资源文件夹
app.use(express.static('dist'))

// 模板字符串，index.html
const template = `
  <html>
    <head>
      <title>React Fiber</title>
    </head>
    <body>
      <div id="root"></div>
			<script src="bundle.js"></script>
    </body>
  </html>
`

app.get('*', (req, res) => {
	res.send(template)
})

// 监听3000 端口
app.listen(3000, () => console.log('server is running'))

import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve, join, extname } from 'node:path'

const root = resolve(process.env.PROJECT_DIR || process.cwd())
const port = Number(process.env.PORT || 3000)
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.wasm':'application/wasm', '.glb':'model/gltf-binary', '.txt':'text/plain' }
const clients = new Set()
const liveScript = `<script data-omgithub-live-preview>(()=>{const e=new EventSource('/__omgithub/live');e.addEventListener('change',()=>{if(window.parent!==window)window.parent.postMessage({type:'omgithub:live-change'},'*');else window.location.reload()});window.addEventListener('pagehide',()=>e.close(),{once:true})})();</script>`
const server = createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname === '/__omgithub/live') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no', Connection: 'keep-alive' })
      res.write(': connected\n\n')
      clients.add(res)
      req.on('close', () => clients.delete(res))
      return
    }
    const path = resolve(root, '.' + decodeURIComponent(url.pathname))
    if (path !== root && !path.startsWith(root + '/')) { res.writeHead(404); res.end(); return }
    const file = (() => { try { return statSync(path).isDirectory() ? join(path, 'index.html') : path } catch { return join(path, 'index.html') } })()
    if (!existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); res.end('Not found'); return }
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream')
    res.setHeader('Cache-Control', 'no-cache')
    const content = readFileSync(file)
    if (extname(file) === '.html') {
      const html = content.toString()
      res.end(/<\/body\s*>/i.test(html) ? html.replace(/<\/body\s*>/i, `${liveScript}</body>`) : html + liveScript)
    } else res.end(content)
  } catch { try { res.writeHead(404); res.end('Not found') } catch {} }
})
server.listen(port, '0.0.0.0', () => console.log(`LoopX preview serving ${root} on :${port}`))

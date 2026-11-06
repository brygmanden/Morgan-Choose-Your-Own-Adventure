import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = process.cwd();
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.vtt':'text/vtt; charset=utf-8'};
const port=Number(process.env.PORT||4173);
http.createServer(async(req,res)=>{
 try{
  const pathName=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const path=resolve(root,'.'+(pathName==='/'?'/index.html':pathName));
  if(!(path===root || path.startsWith(root+sep))){res.writeHead(403);res.end('Forbidden');return;}
  const info=await stat(path);
  if(!info.isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'});
  res.end(await readFile(path));
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,()=>console.log(`Open http://localhost:${port}`));

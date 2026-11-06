import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { pages, routeIsValid, nextRoute, routeTo } from '../src/story.js';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const here=dirname(fileURLToPath(import.meta.url));
test('13 passages, three starting choices and nine complete endings',()=>{
 assert.equal(Object.keys(pages).length,13);
 assert.equal(pages[1].choices.length,3);
 assert.equal(Object.values(pages).filter(p=>!p.choices).length,9);
});
test('all branches lead to real pages and all endings have expert quotes',()=>{
 for(const [n,p] of Object.entries(pages)){
  assert.ok(Array.isArray(p.paras)&&p.paras.length>0,`Page ${n} needs text`);
  if(p.choices){for(const [,dest] of p.choices)assert.ok(pages[dest],`Missing page ${dest}`)}
  else {assert.ok(p.quote&&p.lesson&&p.time,`Page ${n} missing expert material`)}
 }
});
test('route validation, navigation, and returning to earlier page',()=>{
 assert.equal(routeIsValid([1,12,52]),true);
 assert.equal(routeIsValid([1,41,52]),false);
 assert.deepEqual(nextRoute([1,12],63),[1,12,63]);
 assert.deepEqual(routeTo([1,12,63],12),[1,12]);
 assert.throws(()=>nextRoute([1,12],140));
});
test('portrait exists',()=>{
 assert.equal(existsSync(resolve(here,'../public/assets/morgan-graphic-novel-avatar.png')),true);
});

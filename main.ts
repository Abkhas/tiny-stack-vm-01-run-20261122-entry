// Tiny stack VM: runs /input/<id>/program.bin+input.bin, writes /output/<id>/stdout.bin+exit.txt.
import {mkdirSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
function run(p,q){
const n=p.length,S=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O=new Uint8Array(65536);
let s=0,c=0,l=0,i=0,pc=0,t=0;
const e=x=>[O.subarray(0,l),x];
for(;;){
if(t==1e6)return e(10);
if(pc<0||pc>=n)return e(9);
const o=p[pc],b=o>15&&o<23||o>23&&o<27||o>27&&o<31||o>31&&o<35;
if(!(o<8||b||o==23||o==27||o>47&&o<53||o==64||o==65||o>79&&o<84))return e(5);
const m=o==1?1:o==2?4:o>47&&o<52?2:0;
if(pc+m>=n)return e(9);
t++;
const x=pc+1+m;
const u=o==7?3:o==5||o==6||b||o==65?2:o==3||o==4||o==23||o==27||o==49||o==50||o==64||o==80||o==81||o==83?1:0;
const v=o==6||o==7?3:o==4||o==5?2:o==1||o==2||b||o==23||o==27||o==64||o==82?1:0;
if(s<u)return e(2);
if(s-u+v>256)return e(3);
pc=x;
switch(o){
case 0:return e(0);
case 1:S[s++]=(p[x-1]<<24)>>24;break;
case 2:S[s++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24;break;
case 3:s--;break;
case 4:S[s]=S[s-1];s++;break;
case 5:{const a=S[s-1];S[s-1]=S[s-2];S[s-2]=a;break;}
case 6:S[s]=S[s-2];s++;break;
case 7:{const a=S[s-3];S[s-3]=S[s-2];S[s-2]=S[s-1];S[s-1]=a;break;}
case 23:S[s-1]=-S[s-1]|0;break;
case 27:S[s-1]=~S[s-1];break;
case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
const B=S[s-1],A=S[s-2];
if(o>18&&o<23&&!B)return e(4);
const r=o==16?A+B|0:o==17?A-B|0:o==18?Math.imul(A,B):o==19?A==-2147483648&&B==-1?A:(A/B)|0:o==20?B==-1?0:A%B|0:o==21?Math.floor((A>>>0)/(B>>>0))|0:o==22?(A>>>0)%(B>>>0)|0:o==24?A&B:o==25?A|B:o==26?A^B:o==28?A<<(B&31):o==29?A>>(B&31):o==30?(A>>>(B&31))|0:o==32?A==B?1:0:o==33?A<B?1:0:(A>>>0)<(B>>>0)?1:0;
s-=2;S[s++]=r;break;}
case 48:case 49:case 50:{
const r=(p[x-2]|p[x-1]<<8)<<16>>16;
let k=o==48;
if(!k){const v=S[--s];k=o==49?v==0:v!=0;}
if(k)pc=x+r;
break;}
case 51:
if(c==64)return e(7);
C[c++]=x;pc=p[x-2]|p[x-1]<<8;break;
case 52:
if(!c)return e(8);
pc=C[--c];break;
case 64:{const a=S[s-1];if(a<0||a>255)return e(6);S[s-1]=M[a];break;}
case 65:{const a=S[s-1],v=S[s-2];if(a<0||a>255)return e(6);s-=2;M[a]=v;break;}
case 80:{
const g=String(S[s-1]);
if(l+g.length>65536)return e(11);
s--;
for(let j=0;j<g.length;)O[l++]=g.charCodeAt(j++);
break;}
case 81:
if(l+1>65536)return e(11);
O[l++]=S[--s]&255;break;
case 82:S[s++]=i<q.length?q[i++]:-1;break;
case 83:return e(S[--s]&255);
}}
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const d of readdirSync(I).sort()){
const w=run(new Uint8Array(readFileSync(I+'/'+d+'/program.bin')),new Uint8Array(readFileSync(I+'/'+d+'/input.bin')));
mkdirSync(O+'/'+d,{recursive:true});
writeFileSync(O+'/'+d+'/stdout.bin',w[0]);
writeFileSync(O+'/'+d+'/exit.txt',w[1]+'\n');
}

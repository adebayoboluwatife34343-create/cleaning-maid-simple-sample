
export function build(THREE,ctx){
 const {scene,camera,state:st,host}=ctx;
 camera.position.set(.5,.9,15.8);camera.lookAt(.5,.4,0);
 scene.add(new THREE.HemisphereLight(0xfff4e0,0x5a3a2a,1.8));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(3,7,8);scene.add(key);const rim=new THREE.DirectionalLight(0xffd7a0,1.4);rim.position.set(-6,3,-4);scene.add(rim);
 const root=new THREE.Group();scene.add(root);
 const bottle=new THREE.Group();bottle.position.set(-2.3,-1.35,0);bottle.scale.setScalar(.85);root.add(bottle);
 const prof=[[0,0],[.9,0],[.96,.14],[.96,1.9],[.9,2.2],[.55,2.6],[.32,2.8],[.32,3.1],[0,3.1]].map(p=>new THREE.Vector2(p[0],p[1]));
 const glassM=new THREE.MeshPhysicalMaterial({color:0xe9f3ee,transparent:true,opacity:.32,roughness:.08,metalness:0,clearcoat:1,side:THREE.DoubleSide});
 bottle.add(new THREE.Mesh(new THREE.LatheGeometry(prof,48),glassM));
 const liq=new THREE.Mesh(new THREE.CylinderGeometry(.84,.88,1.7,40),new THREE.MeshStandardMaterial({color:0xe7c36a,roughness:.25,transparent:true,opacity:.85}));liq.position.y=.95;bottle.add(liq);
 const label=new THREE.Mesh(new THREE.CylinderGeometry(.975,.975,1,40,1,true,-1.2,2.4),new THREE.MeshStandardMaterial({color:0xfbf5e6,roughness:.7,side:THREE.DoubleSide}));label.position.y=1.0;label.rotation.y=Math.PI/2;bottle.add(label);
 const stripe=new THREE.Mesh(new THREE.CylinderGeometry(.98,.98,.12,40,1,true,-1.2,2.4),new THREE.MeshStandardMaterial({color:0xa9503a,roughness:.6,side:THREE.DoubleSide}));stripe.position.y=1.15;stripe.rotation.y=Math.PI/2;bottle.add(stripe);
 const cap=new THREE.MeshStandardMaterial({color:0xa9503a,roughness:.45});
 const c1=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.28,32),cap);c1.position.y=3.22;bottle.add(c1);
 const head=new THREE.Mesh(new THREE.BoxGeometry(1.05,.52,.55),cap);head.position.set(.35,3.6,0);bottle.add(head);
 const nz=new THREE.Mesh(new THREE.CylinderGeometry(.13,.16,.55,20),new THREE.MeshStandardMaterial({color:0xf2e8d0,roughness:.4}));nz.rotation.z=Math.PI/2;nz.position.set(1.0,3.62,0);bottle.add(nz);
 const tip=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.08,16),new THREE.MeshStandardMaterial({color:0x333}));tip.rotation.z=Math.PI/2;tip.position.set(1.3,3.62,0);bottle.add(tip);
 const trig=new THREE.Group();trig.position.set(.6,3.4,0);bottle.add(trig);const tb=new THREE.Mesh(new THREE.BoxGeometry(.14,.85,.28),cap);tb.position.set(0,-.4,0);tb.rotation.z=.15;trig.add(tb);
 // dip tube
 const tube=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,3,8),new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.6}));tube.position.set(.1,1.7,0);bottle.add(tube);
 // slab
 const slabM=new THREE.MeshStandardMaterial({color:0x8d7b64,roughness:.95,metalness:0});
 const slab=new THREE.Mesh(new THREE.BoxGeometry(4.6,.5,2.8),slabM);slab.position.set(2.1,-1.65,0);root.add(slab);
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(5.6,40),new THREE.MeshBasicMaterial({color:0x45251f,transparent:true,opacity:.18}));shadow.rotation.x=-Math.PI/2;shadow.position.set(0,-1.92,0);root.add(shadow);
 // sparkles
 const sp=[];const spm=new THREE.MeshBasicMaterial({color:0xfff3c0});for(let i=0;i<14;i++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.1,0),spm);m.scale.set(.5,1.6,.5);m.position.set(.2+Math.random()*3.9,-1.3+Math.random()*.6,-1+Math.random()*2);m.userData.ph=Math.random()*6;sp.push(m);root.add(m)}
 // mist
 const N=200,pos=new Float32Array(N*3),vel=new Float32Array(N*3),life=new Float32Array(N).fill(0);let nxt=0;
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const mist=new THREE.Points(geo,new THREE.PointsMaterial({color:0xffffff,size:.16,transparent:true,opacity:.8,depthWrite:false,sizeAttenuation:true}));mist.frustumCulled=false;root.add(mist);
 for(let i=0;i<N;i++)pos[i*3+1]=-99;
 let shine=.1,shineT=.1,pressT=0;const sl=document.querySelector('#val'),out=document.querySelector('#val-out');
 const tipW=new THREE.Vector3();
 function spritz(){pressT=.25;bottle.updateMatrixWorld(true);tip.getWorldPosition(tipW);root.worldToLocal(tipW);for(let k=0;k<50;k++){const i=nxt++%N;pos[i*3]=tipW.x;pos[i*3+1]=tipW.y;pos[i*3+2]=tipW.z;vel[i*3]=2.6+Math.random()*1.3;vel[i*3+1]=-2.4+Math.random()*1.0;vel[i*3+2]=(Math.random()-.5)*1.4;life[i]=.55+Math.random()*.45}
  shineT=Math.min(1,shineT+.2);if(sl)sl.value=shineT}
 if(sl)sl.addEventListener('input',()=>{shineT=parseFloat(sl.value)});
 let dn=null;host.addEventListener('pointerdown',e=>dn=[e.clientX,e.clientY]);host.addEventListener('pointerup',e=>{if(dn&&Math.hypot(e.clientX-dn[0],e.clientY-dn[1])<6)spritz();dn=null});
 host.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();spritz()}});
 const dusty=new THREE.Color(0x8d7b64),clean=new THREE.Color(0xf6ecd6);
 if(st.reduced){shine=shineT}
 return{onAction(){spritz()},onReset(){shineT=.1;if(sl)sl.value=.1},
  update(dt,s){shine+=(shineT-shine)*Math.min(1,dt*(s.reduced?30:3));slabM.color.copy(dusty).lerp(clean,shine);slabM.roughness=.95-shine*.75;slabM.metalness=shine*.1;
   if(out)out.textContent=Math.round(shine*100)+'%';
   pressT=Math.max(0,pressT-dt);trig.rotation.z=pressT>0?.35:0;
   for(let i=0;i<N;i++){if(life[i]>0){life[i]-=dt;vel[i*3+1]-=2*dt;pos[i*3]+=vel[i*3]*dt;pos[i*3+1]+=vel[i*3+1]*dt;pos[i*3+2]+=vel[i*3+2]*dt;if(pos[i*3+1]<-1.35){life[i]=0}if(life[i]<=0)pos[i*3+1]=-99}}
   geo.attributes.position.needsUpdate=true;
   sp.forEach(m=>{const k=Math.max(0,(shine-.45)/.55);const tw=.5+.5*Math.sin(s.t*3+m.userData.ph);m.visible=k>.02;m.scale.set(.5*k*tw,1.6*k*tw,.5*k*tw);m.rotation.z=s.t+m.userData.ph});
   root.rotation.y=s.px*.2+s.dragY*.5+(s.sp-.5)*.4;root.rotation.x=.08+s.py*.05+s.dragX*.3;}}
}

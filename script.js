function scrollTo(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }

    function submitContact(e){ e.preventDefault(); const n=document.getElementById('name').value||'Guest'; gsap.fromTo('.contact-wrap',{y:0},{y:-6,duration:0.12,yoyo:true,repeat:1}); alert('Thanks, '+n+'! (Demo)'); e.target.reset(); }

    (function(){
      const root = document.getElementById('trail-root');
      const count = 10;
      const elements = [];
      for(let i=0;i<count;i++){
        const d = document.createElement('div');
        d.className = 'trail';
        const size = Math.max(2, 10 - i);
        d.style.width = size + 'px';
        d.style.height = size + 'px';
        d.style.borderRadius = '50%';
        d.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.94), rgba(0,191,255,0.9))';
        d.style.opacity = String(1 - i*0.07);
        d.style.position = 'fixed';
        d.style.left = '-100px';
        d.style.top = '-100px';
        document.body.appendChild(d);
        elements.push(d);
      }
      let mx = window.innerWidth/2, my = window.innerHeight/2;
      window.addEventListener('mousemove', (e)=>{ mx=e.clientX; my=e.clientY; });
      function loop(){ let x=mx, y=my; elements.forEach((el, idx)=>{ gsap.to(el, {duration:0.12 + idx*0.02, left:x - el.offsetWidth/2, top:y - el.offsetHeight/2, ease:'power2'}); x += (idx - 2)*1.4; y += (idx - 1.2)*1.2; }); requestAnimationFrame(loop); }
      loop();
    })();

    (function(){
      const canvas = document.getElementById('particles');
      const ctx = canvas.getContext('2d');
      let W = canvas.width = innerWidth;
      let H = canvas.height = innerHeight;
      window.addEventListener('resize', ()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; });
      const n = Math.floor((W*H)/65000) + 70;
      const arr = [];
      for(let i=0;i<n;i++){ arr.push({x:Math.random()*W, y:Math.random()*H, r: Math.random()*1.6+0.2, a:Math.random()*0.9+0.1, s: Math.random()*0.4+0.02}); }
      function draw(){
        ctx.clearRect(0,0,W,H);
        for(const p of arr){
          p.x += Math.cos(p.y*0.0006 + Date.now()*0.00008)*0.3;
          p.y -= p.s;
          if(p.y < -10) p.y = H + 10;
          ctx.beginPath();
          ctx.globalAlpha = p.a*0.9;
          ctx.fillStyle = 'rgba(180,240,255,0.6)';
          ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
      }
      draw();
    })();

    (function(){
      const items = document.querySelectorAll('[data-animate]');
      items.forEach((el, i)=>{
        gsap.from(el, {opacity:0, y:18, duration:0.9, delay:0.12 + i*0.06, ease:'power3.out'});
      });
      // Section titles
      document.querySelectorAll('.section-title').forEach((el,i)=>{
        gsap.from(el, {opacity:0, y:10, duration:0.8, delay:0.06 + i*0.04, ease:'power3.out'});
      });
    })();

    (function(){
      const container = document.getElementById('three-hero');
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 2000);
      camera.position.set(0, 0, 6);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const dir = new THREE.DirectionalLight(0xbfefff, 0.9); dir.position.set(4,3,6); scene.add(dir);

      // Load texture (unsplash sample as demo equirectangular-ish)
      const loader = new THREE.TextureLoader();
      const textureURL = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&q=80'; // blue earth-ish image (demo)
      loader.load(textureURL, (tex)=>{
        tex.anisotropy = 4;
        const mat = new THREE.MeshStandardMaterial({ map: tex, roughness:0.6, metalness:0.02 });
        const geo = new THREE.SphereGeometry(2.0, 64, 64);
        const planet = new THREE.Mesh(geo, mat);
        scene.add(planet);

        // atmosphere glow
        const atmGeo = new THREE.SphereGeometry(2.04, 64, 64);
        const atmMat = new THREE.MeshBasicMaterial({ color:0x00bfff, transparent:true, opacity:0.06, side:THREE.BackSide });
        const atm = new THREE.Mesh(atmGeo, atmMat);
        scene.add(atm);

        // subtle starpoints
        const starsGeo = new THREE.BufferGeometry();
        const starCount = 350;
        const positions = new Float32Array(starCount * 3);
        for(let i=0;i<starCount;i++){
          positions[i*3] = (Math.random()-0.5) * 30;
          positions[i*3+1] = (Math.random()-0.5) * 12;
          positions[i*3+2] = (Math.random()-0.5) * 120;
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
        const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ color:0xaeeeff, size:0.04, transparent:true, opacity:0.9 }));
        scene.add(stars);

        // animate
        function resize(){ renderer.setSize(container.clientWidth, container.clientHeight); camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); }
        window.addEventListener('resize', resize);

        let t = 0;
        function loop(){
          t += 0.01;
          planet.rotation.y += 0.0045;
          atm.rotation.y += 0.0039;
          stars.rotation.y += 0.0009;
          renderer.render(scene, camera);
          requestAnimationFrame(loop);
        }
        loop();
      }, undefined, (err)=>{ console.warn('Texture load failed', err); });

    })();

    (function(){
      const container = document.getElementById('vis-canvas');
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(60, container.clientWidth/container.clientHeight, 0.1, 4000);
      camera.position.set(0, 40, 120);

      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const dl = new THREE.DirectionalLight(0xbfdfff, 0.9); dl.position.set(30,50,60); scene.add(dl);

      // starfield
      const starsGeo = new THREE.BufferGeometry();
      const count = 2000;
      const positions = new Float32Array(count*3);
      for(let i=0;i<count;i++){ positions[i*3] = (Math.random()-0.5)*2000; positions[i*3+1] = (Math.random()-0.5)*1000; positions[i*3+2] = -Math.random()*2000; }
      starsGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
      scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ size:0.8, color:0xaeeeff, opacity:0.55, transparent:true })));

      // planet orbits
      const planetGroup = new THREE.Group();
      const pData = [
        {r:12,size:7,color:0xffb86b,speed:0.0012, name:'Aurelia'},
        {r:24,size:5.6,color:0xb0e0ff,speed:0.0009, name:'Cyris'},
        {r:40,size:11,color:0x2f89c1,speed:0.0006, name:'Terra-2'},
        {r:62,size:14,color:0xff7b7b,speed:0.0004, name:'Rudra'}
      ];
      pData.forEach((p, idx)=>{
        const g = new THREE.Group();
        const geo = new THREE.SphereGeometry(p.size, 48, 48);
        const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness:0.7, metalness:0.05 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(p.r, 0, 0);
        g.add(mesh);
       
        const pts = [];
        const seg=128;
        for(let i=0;i<=seg;i++){ const theta=(i/seg)*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(theta)*p.r, 0, Math.sin(theta)*p.r)); }
        const orbit = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color:0x003a4a, transparent:true, opacity:0.12 }));
        g.add(orbit);
        planetGroup.add(g);
        
      });
      scene.add(planetGroup);

      
      const ship = new THREE.Mesh(new THREE.ConeGeometry(2,6,10), new THREE.MeshStandardMaterial({color:0xdfeeff, emissive:0x77e6ff, emissiveIntensity:0.14}));
      ship.rotation.x = Math.PI/2;
      ship.position.set(-220,-60,-200);
      scene.add(ship);

     
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.dampingFactor=0.08; controls.minDistance=40; controls.maxDistance=800;

      
      window.addEventListener('resize', ()=>{ renderer.setSize(container.clientWidth, container.clientHeight); camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); });

      
      let t=0;
      function animate(){
        t++;
        planetGroup.children.forEach((g, i)=>{ g.rotation.y += pData[i].speed * 2.5; g.children[0].rotation.y += 0.0016 + i*0.0008; });
        const s = (Math.sin(t*0.005) + 1) / 2;
        ship.position.x = -220 + s * 520;
        ship.position.y = -60 + Math.sin(t*0.003)*40;
        ship.position.z = -200 + s * 540;
        ship.rotation.y += 0.02;
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      // Exposed helpers for simple UI if needed
      window.visZoom = function(f){ gsap.to(camera.position, {duration:0.7, x: camera.position.x * f, y: camera.position.y * f, z: camera.position.z * f, onUpdate: ()=>camera.updateProjectionMatrix() }); };
      window.resetCam = function(){ gsap.to(camera.position, {duration:0.9, x:0, y:40, z:120}); controls.target.set(0,0,0); };
    })();

    
    (function(){
      const obs = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            gsap.to(entry.target, {opacity:1, y:0, duration:0.9, ease:'power3.out', overwrite:true});
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      document.querySelectorAll('[data-animate]').forEach(el=>{
        gsap.set(el, {opacity:0, y:18});
        obs.observe(el);
      });
      // also for article cards & planet cards
      document.querySelectorAll('.planet-card, .article-card, .neon-card').forEach((el, i)=>{
        gsap.set(el, {opacity:0, y:24});
        obs.observe(el);
      });
    })();


    
  
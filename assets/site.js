// Old Carrd links keep working
(function(){
  var h=location.hash.slice(1),onHome=!!document.getElementById('listen')&&!!document.getElementById('circle');
  if(!onHome||!h)return;
  var go={privacy:'privacy/',signup:'circle/','privacy-section':'privacy/'}[h];
  if(go){location.replace(go);return}
  var to={music:'listen',home:'home'}[h];
  if(to&&document.getElementById(to))document.getElementById(to).scrollIntoView();
})();

// Mobile menu
(function(){
  var b=document.querySelector('.menu-btn'),n=document.getElementById('nav');
  if(b&&n){
    b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    n.addEventListener('click',function(e){if(e.target.tagName==='A'){n.classList.remove('open');b.setAttribute('aria-expanded',false)}});
  }
})();

// Tally embeds (auto-height)
(function(){
  if(!document.querySelector('iframe[data-tally-src]'))return;
  function load(){if(window.Tally){Tally.loadEmbeds()}else{document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach(function(f){f.src=f.dataset.tallySrc})}}
  var s=document.createElement('script');s.src='https://tally.so/widgets/embed.js';s.onload=load;s.onerror=load;document.body.appendChild(s);
})();

// Copy buttons (press kit)
document.addEventListener('click',function(e){
  var b=e.target.closest('.copy');if(!b)return;
  var t=b.dataset.copy||document.getElementById(b.dataset.target).innerText;
  (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){
    var o=b.textContent;b.textContent='copied';setTimeout(function(){b.textContent=o},1400)
  }).catch(function(){window.prompt('Copy this:',t)});
});

// Share "Ease"
(function(){
  var b=document.getElementById('share-ease');if(!b)return;
  var url='https://open.spotify.com/track/4dL2Sv9Ds2yweuXFF7PB9Z',text='This song made me slow down for a minute. "Ease" by Kate Solmara';
  b.addEventListener('click',function(){
    var l=document.getElementById('share-label');
    if(navigator.share){navigator.share({title:'Ease by Kate Solmara',text:text,url:url}).catch(function(){});return}
    (navigator.clipboard?navigator.clipboard.writeText(text+' '+url):Promise.reject()).then(function(){l.textContent='Link copied. Paste it to a friend!'}).catch(function(){window.prompt('Copy and send:',text+' '+url)});
  });
})();

// Song log
(function(){
  var el=document.getElementById('songs'),d=window.SONGLOG;if(!el||!d)return;
  var label={vote:'in the vote',ready:'written · ready to record',recording:'in the studio',recorded:'recorded · coming soon',released:'out now'};
  function money(n){return '$'+Number(n).toLocaleString('en-US')}
  var h='';
  if(d.fund){var f=d.fund,pct=Math.min(100,Math.round(f.raised/f.goal*100));
    h+='<article class="song is-funding"><div class="song-top"><span class="pill">fund open</span></div><h3>'+f.label+'</h3>'+(f.note?'<p>'+f.note+'</p>':'')+
      '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+f.goal+'" aria-valuenow="'+f.raised+'" aria-label="'+f.label+'"><span style="width:'+pct+'%"></span></div>'+
      '<div class="bar-meta"><b>'+money(f.raised)+'</b> raised of '+money(f.goal)+'<span>'+pct+'%</span></div>'+
      '<div class="btns"><a class="btn solid" href="'+d.supportUrl+'" target="_blank" rel="noopener">Chip in for the next song</a><a class="btn" href="#vote">Vote on which song</a></div></article>';}
  h+='<div class="song-grid">'+d.songs.map(function(s){
    return '<article class="song small-card'+(s.status==='vote'?' is-vote':'')+'"><div class="song-top"><span class="pill">'+(label[s.status]||s.status)+'</span></div>'+
      '<h3>'+s.title+(s.alt?' <span class="alt">or <i>'+s.alt+'</i>?</span>':'')+'</h3>'+(s.note?'<p>'+s.note+'</p>':'')+'</article>';
  }).join('')+'</div>';
  el.innerHTML=h+'<p class="updated">Last updated '+d.updated+'</p>';
})();

// Gentle scroll reveals (content stays visible if anything fails)
(function(){
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var els=document.querySelectorAll('main section .head, main section h2, main section .lede, .feature-quote, .q, .letter p, .cover-art, .player, .helps li, .panel, .fact, .file, .bio, .song');
  var vh=innerHeight;
  document.documentElement.classList.add('js');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el,i){if(el.getBoundingClientRect().top<vh)return;el.classList.add('reveal');el.style.transitionDelay=(i%3)*80+'ms';io.observe(el)});
  setTimeout(function(){document.querySelectorAll('.reveal:not(.in)').forEach(function(el){if(el.getBoundingClientRect().top<innerHeight)el.classList.add('in')})},2500);
})();

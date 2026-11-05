(() => {
  const menu=document.querySelector('#site-menu'),open=document.querySelector('.site-menu-open'),capsule=document.querySelector('.site-capsule');
  if(!menu || !open || !capsule) return;
  const links=[...menu.querySelectorAll('a[href]')];
  function positionMenu(){
    const box=capsule.getBoundingClientRect();
    const width=document.documentElement.clientWidth;
    const height=window.visualViewport?.height || window.innerHeight;
    const left=Math.max(12,Math.min(box.left,width-menu.offsetWidth-12));
    const top=box.bottom+10;
    menu.style.left=`${left}px`;menu.style.top=`${top}px`;
    menu.style.maxHeight=`${Math.max(88,height-top-12)}px`;
  }
  function hideMenu(restoreFocus=false){
    menu.hidden=true;
    open.setAttribute('aria-expanded','false');open.setAttribute('aria-label','Open menu');
    if(restoreFocus) open.focus({preventScroll:true});
  }
  function showMenu(last=false){
    menu.hidden=false;positionMenu();
    open.setAttribute('aria-expanded','true');open.setAttribute('aria-label','Close menu');
    (last?links[links.length-1]:links[0])?.focus({preventScroll:true});
  }
  open.addEventListener('click',()=>menu.hidden?showMenu():hideMenu(true));
  open.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();showMenu(event.key==='ArrowUp')}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){event.preventDefault();hideMenu(true)}});
  document.addEventListener('pointerdown',event=>{if(!menu.hidden&&!menu.contains(event.target)&&!open.contains(event.target))hideMenu()});
  document.addEventListener('focusin',event=>{if(!menu.hidden&&!menu.contains(event.target)&&!open.contains(event.target))hideMenu()});
  menu.addEventListener('click',event=>{if(event.target.closest('a'))hideMenu()});
  menu.addEventListener('keydown',event=>{
    const index=links.indexOf(document.activeElement);if(index<0)return;
    let next;
    if(event.key==='ArrowDown')next=(index+1)%links.length;
    else if(event.key==='ArrowUp')next=(index+links.length-1)%links.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=links.length-1;
    else if(event.key==='Tab'&&event.shiftKey&&index===0){event.preventDefault();hideMenu(true);return}
    else return;
    event.preventDefault();links[next].focus();
  });
  window.addEventListener('resize',()=>{if(!menu.hidden)positionMenu()});
  window.visualViewport?.addEventListener('resize',()=>{if(!menu.hidden)positionMenu()});
})();

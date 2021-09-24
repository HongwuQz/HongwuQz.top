let vir = document.querySelector('#KillVirus');
		
vir.onmouseover = function(){
    this.style.boxShadow = '0 0 3px 3px #26af3f,0 0 5px 2px #86fa9b';
    this.style.transition = 'box-shadow .1s ease';
}

vir.onmouseout = function(){
    this.style.boxShadow = '0 0 3px 3px #0c7920,0 0 5px 2px #67f781';
    this.style.transition = 'box-shadow .2s ease';
}
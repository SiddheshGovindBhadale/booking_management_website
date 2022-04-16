let menu = document.getElementById("sideMenu")
      let bg = document.getElementById("bg")
      let opened = false
      
      bg.addEventListener("click" , function(){
        menu.style.left="-285px"
        bg.classList.remove("blur")
        opened = false
      })
      
      function toggle(){
        if(!opened){
           menu.style.left="0"
           bg.classList.add("blur")
           opened = true
        }else{
           menu.style.left="-285px"
           bg.classList.remove("blur")
           opened = false
        }
      }
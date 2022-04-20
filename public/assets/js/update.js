// update 
let patchBtn = document.getElementById("patchBtn")
let upName = document.getElementById("upName")
let upType = document.getElementById("upType")
let upTime = document.getElementById("upTime")
let upPrice = document.getElementById("upPrice")
let upBPrice = document.getElementById("upBPrice")
let upPreTest = document.getElementById("upPreTest")


function update(index){
   let text = document.getElementById(`${index}`)
   let parent = text.parentElement.parentElement
   let i = 0
   
   let obj = {}
   
   upName.value = parent.children[0].textContent
   upPreTest.value = parent.children[1].children[1].textContent
   upTime.value = parent.children[2].children[1].children[0].textContent
   upPrice.value = parent.children[3].children[0].children[1].textContent
   upBPrice.value = parent.children[3].children[1].children[1].textContent
   upType.value = parent.children[4].textContent
   
   patchBtn.addEventListener("click" , function(e){
      e.preventDefault()
      
      
      fetch(postUrl)
        .then(res => res.json())
        .then(data => {
              i = data[index]._id
              
              obj = {
                  name:upName.value,
                  preTest:upPreTest.value,
                  dTime:upTime.value,
                  price:upPrice.value,
                  bPrice:upBPrice.value,
                  type:upType.value,
              }
              console.log(obj)
              
              console.log(i)
              fetch(`${postUrl}/${i}` , {
                   method: 'PATCH',
                   headers:{
                           'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(
                         obj
                   ),
              })
              .then(res => res.json())
              .then(data => {
                    window.location.reload();
               })
              .catch(error => {
                   console.log(error);
              });
              
        })
        .catch((e)=>{
              console.log(e)
        })
   })
}
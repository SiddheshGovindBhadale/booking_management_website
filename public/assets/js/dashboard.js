
let url1 = "/booking"
let url2 = "/collected"
let url3 = "/completed"
let url4 = "/userData"
let tbody = document.querySelector("tbody")
let models = document.getElementById("models")
let changeBtn = document.querySelector(".changeBtn")


function pending(id){
  let Data = "" ;
  let model = ""
  loade()
  fetch(url1)
  .then(res => res.json())
  .then(data => { 
       let no = 0
        data.forEach(function(item , index){
          //console.log(item.userID == id)
          if(item.userID == id){
             Data += `
                 <tr>
                    <td>${String(no += 1).padStart(2,'0')}</td>
                    <td>${data[index].date}</td>
                    <td>${data[index].name}</td>
                    <td>${data[index].email}</td>
                    <td>${item.phone}</td>
                    <td>${item.test}</td>
                    <td><a href="#!" data-bs-toggle="modal" data-bs-target="#models${item._id}">View</a></td>
                    <td>${item.place}</td>
                    <td>${item.pincode}</td>
                    <td class="address" >${item.address}</td>
                    <td style="color:red;">${item.status}</td>
                    <td>
                       <span class="action_btn">
                            <a href="#!" style="display:none;" >Collected</a>
                            <a href="#!" id="${item._id}" onclick="remove(this.id)">Cancel</a>
                       </span>
                    </td>
                 </tr>
             `
             
             model += `
                 <!-- Modal -->
                 <div class="modal fade" id="models${item._id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                     <div class="modal-dialog modal-fullscreen">
                          <div class="modal-content">
                               <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Prescription</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                               </div>
                               <div class="modal-body">
                                    <img src="http://localhost:3000/product/${item.image.filename}" style="width:100%; height 100%" >
                               </div>
                               <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                               </div>
                          </div>
                     </div>
                 </div>
             `
          }
  
        })
        tbody.innerHTML = Data;
        models.innerHTML = model
        if(data.length == "0"){
        tbody.innerHTML = `<p style="padding-top:10px ; font-size:1.1rem; font-weidth:600;">Nothing To show</p>`
        }
        
  })
  .catch((e)=>{
  console.log(e)
  })
  changeBtn.children[0].classList.add('active')
  changeBtn.children[1].classList.remove('active')
  changeBtn.children[2].classList.remove('active')
  }
  
  
  fetch(url4)
  .then(res => res.json())
  .then(data => { 
  pending(data._id)
  })
  .catch((e)=>{
  console.log(e)
  })
  
  
  
  function collected(id){
  let Data = "" ;
  let model = ""
  loade()
  fetch(url2)
  .then(res => res.json())
  .then(data => { 
  let no = 0
  data.forEach(function(item2 , index){
  //console.log(item2.userID == id)
  
  if(item2.userID == id){
  Data += `
  <tr>
  <td>${String(no += 1).padStart(2,'0')}</td>
  <td>${item2.date}</td>
  <td>${item2.name}</td>
  <td>${item2.email}</td>
  <td>${item2.phone}</td>
  <td>${item2.test}</td>
  <td><a href="#!" data-bs-toggle="modal" data-bs-target="#models${item2._id}">View</a></td>
  <td>${item2.place}</td>
  <td>${item2.pincode}</td>
  <td class="address" >${item2.address}</td>
  <td style="color:red;">${item2.status}</td>
  <td>
  <span class="action_btn">
  <a href="#!" style="display:none;">Collected</a>
  <a href="#!" disabled>Cancel</a>
  </span>
  </td>
  </tr>
  `
  
  model += `
  <!-- Modal -->
  <div class="modal fade" id="models${item2._id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
  <div class="modal-content">
  <div class="modal-header">
  <h5 class="modal-title" id="exampleModalLabel">Prescription</h5>
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body">
  <img src="http://localhost:3000/product/${item2.image.filename}" style="width:100%; height 100%" >
  </div>
  <div class="modal-footer">
  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
  </div>
  </div>
  </div>
  </div>
  `
  }
  })
  tbody.innerHTML = Data;
  models.innerHTML = model
  if(data.length == "0"){
  tbody.innerHTML = `<p style="padding-top:10px ; font-size:1.1rem; font-weidth:600;">Nothing To show</p>`
  }
  })
  .catch((e)=>{
  console.log(e)
  })
  changeBtn.children[1].classList.add('active')
  changeBtn.children[0].classList.remove('active')
  changeBtn.children[2].classList.remove('active')
}


function completed(id){
  let Data = "" ;
  let model = ""
  loade()
  
  fetch(url3)
  .then(res => res.json())
  .then(data => { 
  let no = 0
  data.forEach(function(item3 , index){
  
  if(item3.userID == id){
  Data += `
  <tr>
  <td>${String(Number(no += 1)).padStart(2,'0')}</td>
  <td>${item3.date}</td>
  <td>${item3.name}</td>
  <td>${item3.email}</td>
  <td>${item3.phone}</td>
  <td>${item3.test}</td>
  <td><a href="#!" data-bs-toggle="modal" data-bs-target="#models${item3._id}">View</a></td>
  <td>${item3.place}</td>
  <td>${item3.pincode}</td>
  <td class="address" >${item3.address}</td>
  <td style="color:green;">${item3.status}</td>
  <td>
  <span class="action_btn">
  <a href="#!" style="display:none;">Collected</a>
  <a href="#!" disabled>Cancel</a>
  </span>
  </td>
  </tr>
  `
  
  model += `
  <!-- Modal -->
  <div class="modal fade" id="models${item3._id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
  <div class="modal-content">
  <div class="modal-header">
  <h5 class="modal-title" id="exampleModalLabel">Prescription</h5>
  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body">
  <img src="http://localhost:3000/product/${item3.image.filename}" style="width:100%; height 100%" >
  </div>
  <div class="modal-footer">
  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
  </div>
  </div>
  </div>
  </div>
  `
  }
  })
  
  tbody.innerHTML = Data;
  models.innerHTML = model
  if(data.length == "0"){
  tbody.innerHTML = `<p style="padding-top:10px ; font-size:1.1rem; font-weidth:600;">Nothing To show</p>`
  }
  })
  .catch((e)=>{
  console.log(e)
  })
  
  changeBtn.children[2].classList.add('active')
  changeBtn.children[1].classList.remove('active')
  changeBtn.children[0].classList.remove('active')
  
  }



// delete function
function remove(id){
    let check = confirm("Do you really want Cancel appointment")
    if(check == true){
      console.log("delete")
     fetch(url1 + "/" + id, {
           method: 'DELETE'
     })
     .then(() => {})
     .catch(err => {
         console.error(err)
     });
     Display('success', 'Appoinment Cancelled')
     document.location.reload(true)
    }
}
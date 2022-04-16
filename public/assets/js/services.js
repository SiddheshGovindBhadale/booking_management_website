console.log("js")
let url = "/services"
let Services = document.getElementById("services")
let serviceModel = document.getElementById("models")

// show services in page
function showData(){
    let ServicesData = ""
    let ServicesModels = ""
    /*get request*/
    fetch(url)
    .then(res => res.json())
    .then(data => {
        data.forEach(function(item,index){
          ServicesData += `
                   <div class="box serviceBox">
                        <h3>${item.name}</h3>
                        <div class="pre_info">
                             <p><b>Pre Test Information :</b></p>
                             <span>${item.preTest}</span>
                        </div>
                        <div class="repo_delevery">
                             <p><b>Report Delevry :</b></p>
                             <span>${item.dTime} hours</span>
                        </div>
                        <div class="price" >
                             <h5 class="current" ><i class="fa-solid fa-indian-rupee-sign"></i> ${item.price}</h5>
                             <h5 class="before" ><i class="fa-solid fa-indian-rupee-sign"></i> ${item.bPrice}</h5>
                        </div>
                        <div class="buttons">
                             <a href="#!" class="button" data-toggle="modal" data-target="#${item._id}">View Details</a>
                             <a href="#!" class="button" onclick="sendData(${index})">Book now</a>
                        </div>
                        <p style="display:none;">${item.type}</p>
                        <p class="info"><i class='bx bx-home-alt'></i> Home Collection Available</p>
                   </div>
          `
          
          ServicesModels += `
                   <div class="modal fade" id="${item._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                             <div class="modal-content">
                   
                                  <article class="card__content grid">
                                       <div class="card__pricing">
                                            <div class="card__pricing-number">
                                                 <div class="price" style="flex-direction: column;" >
                                                      <h5 class="current" style=" color:#fff;" ><i class="fa-solid fa-indian-rupee-sign"></i> ${item.price}</h5>
                                                      <h5 class="before" style=" color:#fff;"><i class="fa-solid fa-indian-rupee-sign"></i> ${item.bPrice}</h5>
                                                 </div>
                                            </div>
                                            <!--<span class="card__pricing-month">/test</span>-->
                                       </div>
                   
                                       <header class="card__header">
                                            <div class="card__header-circle ">
                                                 <a href="#!" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                 </a>
                                            </div>
                    
                                            <span class="card__header-subtitle">Most popular</span>
                                            <h1 class="card__header-title">${item.name}</h1>
                                       </header>
                   
                                       <table class="table">
                                              <tbody>
                                                   <tr>
                                                       <td></td>
                                                       <td></td>
                                                       <td></td>
                                                   </tr>
                                                   <tr>
                                                       <td style="display:flex;"><span><i class="fa-solid fa-flask"></i></span>
                                                           <p> Test Type</p>
                                                       </td>
                                                       <td>:</td>
                                                       <td>${item.type}</td>
                                                   </tr>
                                                   <tr>
                                                       <td>
                                                          <div style="display:flex;"><span><i class="fas fa-info-circle"></i></span>
                                                               <p> Pre-test Information</p>
                                                          </div>
                                                       </td>
                                                       <td>:</td>
                                                       <td>${item.preTest}</td>
                                                   </tr>
                                                   <tr>
                                                       <td style="display:flex;"><span><i class="fa-solid fa-clock"></i></span>
                                                           <p> Report Delivery</p>
                                                       </td>
                                                       <td>:</td>
                                                       <td>${item.dTime} hours</td>
                                                   </tr>
                                                   <tr>
                                                       <td style="display:flex;">
                                                           <span><i class="fa-solid fa-indian-rupee-sign" style="margin:0 5px;"></i></span>
                                                           <p> Price</p>
                                                       </td>
                                                       <td>:</td>
                                                       <td><span><i class="fa-solid fa-indian-rupee-sign"></i></span> <span>${item.price} </span></td>
                                                   </tr>
                                             </tbody>
                                       </table>
                                                   
                                       <a href="#!" class="card__button" onclick="sendData(${index})">Book Appointment</a>
                                 </article>
                             </div>
                       </div>
                  </div>
          `
        }) 
        Services.innerHTML = ServicesData
        serviceModel.innerHTML = ServicesModels
    })
    .catch((e)=>{
    console.log(e)
    })
}

showData()

// send data to other pages
function sendData(id){
    /*let clickedID = document.getElementById(id)
    let parent = clickedID.parentElement.parentElement
    let title = parent.children[0].innerText
    let preTest = parent.children[1].children[1].innerText
    let dTime = parent.children[2].children[1].innerText
    let price = parent.children[3].innerText
    let type = parent.children[6].innerText
    */
    fetch(url)
    .then(res => res.json())
    .then(data => {
       
    
             let bookObj ={
                 title : data[id].name,
                 preTest: data[id].preTest,
                 dTime: data[id].dTime,
                 price: data[id].price,
                 type: data[id].type
             };
             console.log(bookObj.title)
    
             let localBook = sessionStorage.getItem("myBooking");
    
             if(localBook == null){
                 bookArr = [];
             }else{
                 bookArr = JSON.parse(localBook);
             }
    
             bookArr.push(bookObj);
    
             sessionStorage.setItem("myBooking", JSON.stringify(bookArr));
    
             location.href ="./bookForm.html"
        }) 
    
    .catch((e)=>{
         console.log(e)
    })
 }
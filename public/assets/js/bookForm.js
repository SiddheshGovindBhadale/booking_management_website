console.log("booking")
let testName = document.getElementById("test")


let url = "http://localhost:3000/services"
let Services = document.getElementById("services")

// show services in page
function showData(){
    let ServicesList = ""
    /*get request*/
    fetch(url)
    .then(res => res.json())
    .then(data => {
        data.forEach(function(item,index){
          ServicesList += `
                  
                  <option value="${item.name}">${item.name}</option>
          `
        })
        let lable = `<option >Select test</option>`
        testName.innerHTML = lable + ServicesList
    })
    .catch((e)=>{
    console.log(e)
    })
}

showData()




// get data from session storage
let localBook = sessionStorage.getItem("myBooking");
   
   if(localBook == null){
     bookArr = [];
   }else{
     bookArr = JSON.parse(localBook);
   }
   
   if(bookArr.length > 0){
     let objIndex = bookArr.length - 1
     let lastEle = bookArr[objIndex]
     let timesRun = 0
     console.log(lastEle.title)
     const myInterval = setInterval(select, 100);
     function select(){
       document.getElementById("test").selectedIndex = objIndex + 1; 
       timesRun += 1;
       console.log(timesRun)
       if(timesRun === 6){
          clearInterval(myInterval);
       }
   }
   
   }
   //testName.value = lastEle.title
   
   
   
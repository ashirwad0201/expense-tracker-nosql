
var expenseTable = document.querySelector('#table-expense tbody');
var incomeTable = document.querySelector('#table-income tbody');
var downlaodsTable = document.querySelector('#table-downloads tbody');
var leaderboardList=document.getElementById('list-items2');
var pagination=document.getElementById('paginate-expense');
expenseTable.addEventListener('click' ,removeElement);
incomeTable.addEventListener('click' ,removeElement);
const token=localStorage.getItem('token');
var isPremium=false;

function itemsPerPage(){
    console.log("hi")
    const noOfItems=document.getElementById('idk11').value;
    console.log(noOfItems)
    localStorage.setItem('itemsPerPage',noOfItems)
    getExpense(1)
}
function getExpense(page){
    console.log("hi i am token")
    console.log(token)
    expenseTable.innerHTML = "";
    axios.get(`${API_ENDPOINT}get-expense/?page=${page}&itemsPerPage=${localStorage.getItem('itemsPerPage')}`,{headers:{"authorization": token}})
    .then(
        (response)=>{
            console.log('------------------------')
            console.log(response)
            for(var i=0;i<response.data.expenses.length;i++){
                showData2(response.data.expenses[i]);
            }
            console.log(response.data)
            showPagination(response.data)
        }
    )
    .catch(
        (err)=>console.log(err)
    )
}
function getSalary(){
    const page=1;
    incomeTable.innerHTML = "";
    axios.get(`${API_ENDPOINT}get-income/?page=${page}`,{headers:{"authorization": token}})
    .then(
        (response)=>{
            for(var i=0;i<response.data.length;i++){
                showData2(response.data[i]);
            }
        }
    )
    .catch(
        (err)=>console.log(err)
    )
}
function getDownload(){
    console.log("hi i am token")
    console.log(token)
    axios.get(`${API_ENDPOINT}premium/getdownload`,{headers:{"authorization": token}})
    .then(
        (response)=>{
            for(var i=0;i<response.data.length;i++){
                showDownload(response.data[i]);
            }
        }
    )
    .catch(
        (err)=>console.log(err)
    )
}

window.addEventListener('DOMContentLoaded',()=>{
    axios.post(`${API_ENDPOINT}ispremium`,{},{headers:{"authorization": token}})
    .then((res)=>{
        if(res.data.isPremium===true){
            document.getElementById('idk5').style.display='none';
            document.getElementById('idk6').style.display='block';
            document.getElementById('table-downloads').style.display='block';
        }
    })
    .catch((err)=>console.log(err));
    document.getElementById('idk11').value=localStorage.getItem('itemsPerPage')||2;
    getExpense(1);
    //getSalary();
    //getDownload();
    })

function tracker(){
    var expAmount_=document.getElementById('idk1').value;
    var desc_=document.getElementById('idk2').value;
    var categ_=document.getElementById('idk3').value;
    

    let myObj={
        price: expAmount_,
        description: desc_,
        category: categ_
    };
    console.log("hi i am post token")
    console.log(token)
    if(categ_=="salary"){
        axios.post(`${API_ENDPOINT}insert-income`,myObj,{headers:{"authorization": token}})
        .then((res)=>{
            console.log("about to print salary")
            getSalary();
        })
        .catch((err)=>console.log(err));
    }
    else{
        axios.post(`${API_ENDPOINT}insert-expense`,myObj,{headers:{"authorization": token}})
        .then((res)=>getExpense())
        .catch((err)=>console.log(err));
    }
} 
function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage,
}){
    pagination.innerHTML='';
    if(hasPreviousPage){
        const btn2=document.createElement('button')
        btn2.innerHTML=previousPage;
        btn2.className="btn btn-secondary animated-button"
        btn2.addEventListener('click',()=>getExpense(previousPage))
        pagination.appendChild(btn2)
    }
    const btn1=document.createElement('button')
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.className="btn btn-primary"
    btn1.addEventListener('click',()=>getExpense(currentPage))
    pagination.appendChild(btn1)
    console.log(hasNextPage);
    console.log(hasPreviousPage)
    if(hasNextPage){
        console.log("i am in")
        const btn3=document.createElement('button')
        btn3.innerHTML=nextPage;
        btn3.className="btn btn-secondary animated-button-reverse"
        btn3.addEventListener('click',()=>getExpense(nextPage))
        pagination.appendChild(btn3)
    }
}
function showData2(myObj){
    console.log("hi")
    console.log(myObj)
    var row = document.createElement('tr');

    // Create table cells
    var priceCell = document.createElement('td');
    priceCell.className='text-center'
    priceCell.textContent = myObj.price;

    var descriptionCell = document.createElement('td');
    descriptionCell.className='text-center'
    descriptionCell.textContent = myObj.description;

    var categoryCell = document.createElement('td');
    categoryCell.className='text-center'
    categoryCell.textContent = myObj.category;

    var actionCell = document.createElement('td');
    actionCell.className='text-center'
    var delButton = document.createElement('button');
    delButton.className = 'btn btn-danger btn-sm delete';
    delButton.textContent = 'Delete';
    actionCell.appendChild(delButton);

    // Append cells to the row
    row.appendChild(categoryCell);
    row.appendChild(descriptionCell);
    row.appendChild(priceCell);
    row.appendChild(actionCell);

    row.setAttribute('item-id',myObj._id);
    row.setAttribute('item-price',myObj.price);
    row.setAttribute('item-category',myObj.category);

    // Append row to the table body
    if(myObj.category=="salary"){
        incomeTable.appendChild(row);
        incomeTable.classList.add('table-responsive');
    }
    else{
        expenseTable.appendChild(row);
        expenseTable.classList.add('table-responsive');
    }
}

function showDownload(myObj){
    console.log(myObj)

    console.log("hi in download")
    console.log(myObj)
    var row = document.createElement('tr');

    // Create table cells
    var  nameCell= document.createElement('td');
    nameCell.className='text-center'
    nameCell.textContent = myObj.name;

    var urlCell = document.createElement('td');
    urlCell.className='text-center'
    var a=document.createElement("a");
    a.href=myObj.url;
    a.textContent = myObj.url;
    urlCell.appendChild(a);

    // Append cells to the row
    row.appendChild(nameCell);
    row.appendChild(urlCell);

    // Append row to the table body
    downlaodsTable.appendChild(row);
    downlaodsTable.classList.add('table-responsive');
}



function removeElement(e){
    if(e.target.classList.contains('delete')){
        if(confirm('Are you sure to delete ?')){
            var row=e.target.parentElement.parentElement;
            console.log(row)
            const id=row.getAttribute('item-id')
            const amount=row.getAttribute('item-price')
            const categ=row.getAttribute('item-category')
            console.log("amount-"+categ)
            if(categ=="salary"){
                axios.delete(`${API_ENDPOINT}delete-income/${id}`,{params: {amount : amount},headers:{"authorization": token}})
                .then(res=>console.log(res))
                .catch(err=>console.log(err))
                incomeTable.removeChild(row);
            }
            else{
                axios.delete(`${API_ENDPOINT}delete-expense/${id}`,{params: {amount : amount},headers:{"authorization": token}})
                .then(res=>console.log(res))
                .catch(err=>console.log(err))
                expenseTable.removeChild(row);
            }
        }
    }
}

document.getElementById('idk5').onclick = async function(e){
    const token=localStorage.getItem('token');
    const response= await axios.get(`${API_ENDPOINT}premiummembership`,{headers:{"authorization": token}});
    console.log(response);
    var options=
    {
        "key": response.data.key_id,
        "order_id": response.data.order._id,
        "handler": async function(response){
            await axios.post(`${API_ENDPOINT}updatetransactionstatus`,{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            },{headers:{"authorization": token}})
            alert("You are a premium user now")
            document.getElementById('idk5').style.display='none';
            document.getElementById('idk6').style.display='block';
            document.getElementById('table-downloads').style.display='block';
        }
    };
    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment failed',function(response){
        console.log(repsonse)
        alert('Something went wrong')
    });
}

document.getElementById('idk7').onclick = async function(e){
    console.log("I am in")
    const leaderboard=await axios.get(`${API_ENDPOINT}premium/get-leaderboard`)
    leaderboard.data.forEach(user => {
        var newList=document.createElement('li');
        newList.className="list-group-item"
        var text='Name- '+user.username+' Total Expense- '+(user.totalexpense || 0);
        newList.appendChild(document.createTextNode(text));
        leaderboardList.appendChild(newList);       
    });
    document.getElementById('idk10').style.display='block';
    console.log(leaderboard)
}

async function report(){
    const input=document.getElementById('idk8').value;
    const year=input.substring(0,4);
    const month=input.substring(5,7);
    const url=`../Premium/premium.html?year=${year}&month=${month}`;
    window.location.href=url;
}